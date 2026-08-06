export const siteMetadata = {
  title: "PlanIt - Task Management Made Simple",
  description: "A beautiful, real-time task management app with dark mode, filtering, and analytics.",
  url: "https://plan-it-bay-zeta.vercel.app",
  image: "/og-image.png",
};

export function generateMetadata(title, description) {
  return {
    title: `${title} | PlanIt`,
    description,
    openGraph: {
      title: `${title} | PlanIt`,
      description,
      url: siteMetadata.url,
      siteName: "PlanIt",
      locale: "en_US",
      type: "website",
    },
  };
}