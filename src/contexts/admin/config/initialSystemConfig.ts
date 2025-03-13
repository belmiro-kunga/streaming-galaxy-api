
export const initialSystemConfig = {
  general: {
    // Informações Básicas
    siteName: "",
    siteDescription: "",
    siteKeywords: "",

    // Layout e Aparência
    desktopLayout: true,
    mobileLayout: true,
    primaryFont: "inter",
    fontSize: "medium" as const,
    primaryColor: "#0066FF",
    secondaryColor: "#1A1A1A",
    accentColor: "#FF3366",

    // Cabeçalho
    showMainMenu: true,
    showSearchBar: true,
    showLoginButton: true,
    menuItems: "Home, Filmes, Séries, Categorias",

    // Rodapé
    showFooterLinks: true,
    showSocialIcons: true,
    footerText: "© 2024 Streaming Galaxy. Todos os direitos reservados.",
    socialLinks: "Facebook: https://facebook.com/streaminggalaxy\nInstagram: https://instagram.com/streaminggalaxy\nTwitter: https://twitter.com/streaminggalaxy",

    // Configurações Regionais
    timezone: "America/Sao_Paulo",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "24h"
  },
  logo: {
    logo: '',
    favicon: '',
    footerLogo: ''
  },
  notifications: {
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    notificationSound: true
  },
  paymentGateways: {
    stripe: false,
    paypal: false,
    mercadoPago: true,
    pix: true,
    manualPayment: true
  },
  templates: {
    activeTemplate: 'default',
    colorScheme: 'dark',
    fontFamily: 'Inter'
  },
  socialLogin: {
    google: false,
    facebook: false,
    apple: false
  },
  maintenance: {
    enabled: false,
    message: '',
    allowedIPs: []
  },
  policies: {
    termsOfService: '',
    privacyPolicy: '',
    cookiePolicy: '',
    refundPolicy: ''
  },
  gdpr: {
    enabled: false,
    cookieMessage: '',
    policyUrl: ''
  },
  robotsTxt: ''
};
