export const clerkAppearance = {
  variables: {
    colorPrimary: "#3b82f6",
    colorBackground: "hsl(226 44% 9%)",
    colorInputBackground: "rgba(255,255,255,0.05)",
    colorInputText: "hsl(210 40% 98%)",
    colorText: "hsl(210 40% 98%)",
    colorTextSecondary: "hsl(219 13% 72%)",
    borderRadius: "0.375rem"
  },
  elements: {
    rootBox: "w-full",
    card: "bg-transparent shadow-none border-0 p-0 gap-4",
    headerTitle: "hidden",
    headerSubtitle: "hidden",
    socialButtonsBlockButton:
      "h-11 border border-white/10 bg-white/5 text-sm font-medium hover:bg-white/10 transition",
    socialButtonsBlockButtonText: "text-sm font-medium",
    dividerLine: "bg-white/10",
    dividerText: "text-muted-foreground text-xs",
    formFieldLabel: "text-muted-foreground text-sm",
    formFieldInput:
      "h-11 rounded-md border border-white/10 bg-white/5 text-sm outline-none focus:border-blue-400",
    formButtonPrimary:
      "h-11 rounded-md bg-gradient-to-r from-blue-500 via-violet-500 to-cyan-400 text-white shadow-glow hover:brightness-110",
    footerActionLink: "text-cyan-200 hover:text-cyan-100",
    identityPreview: "border border-white/10 bg-white/5",
    formFieldInputShowPasswordButton: "text-muted-foreground"
  }
};
