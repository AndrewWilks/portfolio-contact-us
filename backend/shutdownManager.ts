type ShutdownAction = () => Promise<void>;

export class ShutdownManager {
  private tasks: ShutdownTask[] = [];
  private readonly separator: string;
  private readonly width: number;
  private progressSpinner = [
    "▉",
    "▊",
    "▋",
    "▌",
    "▍",
    "▎",
    "▏",
    "▎",
    "▍",
    "▌",
    "▋",
    "▊",
    "▉",
  ];
  private spinnerIndex = 0;
  private spinnerInterval: number | undefined;
  private encoder = new TextEncoder();

  constructor(private server: IServer, separatorLength = 39) {
    this.separator = "=".repeat(separatorLength);
    this.width = this.separator.length;
    // register built-in tasks (Open/Closed: can register more without modifying internals)
    this.registerDefaults();
  }

  private registerDefaults() {
    this.registerTask(
      new ShutdownTask(
        "server",
        async () => {
          await this.server.shutdown();
        },
        "Shutting down server",
        "Server shut down complete",
      ),
    );
  }

  public registerTask(task: ShutdownTask) {
    this.tasks.push(task);
  }

  private alignCenter(text: string) {
    return text.padStart((this.width + text.length) / 2).padEnd(this.width);
  }

  private startSpinner(prefix: string) {
    this.spinnerIndex = 0;
    // initial draw
    Deno.stdout.writeSync(
      this.encoder.encode(`\r ${this.progressSpinner[0]} ${prefix}`),
    );
    this.spinnerInterval = setInterval(() => {
      const spinner =
        this.progressSpinner[this.spinnerIndex % this.progressSpinner.length];
      this.spinnerIndex++;
      Deno.stdout.writeSync(this.encoder.encode(`\r${spinner} ${prefix}`));
    }, 100) as unknown as number;
  }

  private stopSpinner(clearLine = true) {
    if (this.spinnerInterval !== undefined) {
      clearInterval(this.spinnerInterval);
      this.spinnerInterval = undefined;
    }
    if (clearLine) {
      Deno.stdout.writeSync(
        this.encoder.encode(`\r${" ".repeat(this.width)}\r`),
      );
    }
  }

  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private async runTaskWithSpinner(task: ShutdownTask) {
    console.log(this.separator);
    const startMsg = task.startMessage ?? task.id;
    const endMsg = task.endMessage ?? `${task.id} complete`;
    console.log(startMsg + "...");
    this.startSpinner(startMsg);
    try {
      await task.action();
      // little delay so spinner is visible briefly
      await this.delay(50);
      this.stopSpinner();
      console.log(endMsg + ".");
    } catch (err) {
      this.stopSpinner();
      console.error(`Error during ${task.id}: ${String(err)}`);
    }
    console.log(this.separator);
  }

  public async shutdown() {
    console.log(this.separator);
    console.log(this.separator);
    console.log(this.alignCenter(" SIGINT received - shutting down "));
    for (const task of this.tasks) {
      await this.runTaskWithSpinner(task);
    }
    console.log(this.alignCenter("Goodbye!"));
    console.log(this.separator);
    console.log(this.separator);
    // ensure process exit after cleanup
    Deno.exit();
  }

  // helper to attach to signal(s)
  public listenToSignal(signalName: Deno.Signal = "SIGINT") {
    Deno.addSignalListener(signalName, async () => {
      await this.shutdown();
    });
  }
}

export interface IServer {
  shutdown: () => Promise<void>;
}

export class ShutdownTask {
  constructor(
    public id: string,
    public action: ShutdownAction,
    public startMessage?: string,
    public endMessage?: string,
  ) {}
}
