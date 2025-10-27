export const qk = {
  contacts: {
    all: ["contacts"] as const,
    list: ["contacts", "list"] as const,
    detail: (id: string) => ["contacts", "detail", id] as const,
  },
} as const;
