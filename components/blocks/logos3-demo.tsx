import { Logos3 } from "@/components/blocks/logos3";

const demoData = {
  heading: "Trusted by these companies",
  logos: [
    {
      id: "logo-1",
      description: "Astro",
      image: "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=120&h=40&fit=crop&auto=format",
      className: "h-7 w-auto",
    },
    {
      id: "logo-2",
      description: "Figma",
      image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=120&h=40&fit=crop&auto=format",
      className: "h-7 w-auto",
    },
    {
      id: "logo-3",
      description: "Next.js",
      image: "https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=120&h=40&fit=crop&auto=format",
      className: "h-7 w-auto",
    },
    {
      id: "logo-4",
      description: "React",
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=120&h=40&fit=crop&auto=format",
      className: "h-7 w-auto",
    },
    {
      id: "logo-5",
      description: "shadcn/ui",
      image: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=120&h=40&fit=crop&auto=format",
      className: "h-7 w-auto",
    },
    {
      id: "logo-6",
      description: "Supabase",
      image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=120&h=40&fit=crop&auto=format",
      className: "h-7 w-auto",
    },
    {
      id: "logo-7",
      description: "Tailwind CSS",
      image: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=120&h=40&fit=crop&auto=format",
      className: "h-4 w-auto",
    },
    {
      id: "logo-8",
      description: "Vercel",
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=120&h=40&fit=crop&auto=format",
      className: "h-7 w-auto",
    },
  ],
};

function Logos3Demo() {
  return <Logos3 {...demoData} />;
}

export { Logos3Demo };
