import { SectionHeader } from "@/components/ui/panel";

export function PageHeading({
  eyebrow,
  title,
  description,
  children
}: {
  eyebrow: string;
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-6">
      <SectionHeader eyebrow={eyebrow} title={title} description={description} action={children} />
    </div>
  );
}
