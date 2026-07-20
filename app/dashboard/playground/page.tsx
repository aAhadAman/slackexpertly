import { PageHeader } from "@/components/dashboard/ui";
import { PlaygroundClient } from "@/components/dashboard/playground-client";

export const metadata = { title: "Test the bot · Policy Expert" };

export default function PlaygroundPage() {
  return (
    <>
      <PageHeader
        title="Test the bot"
        description="Preview exactly what employees see in Slack or Teams."
      />
      <PlaygroundClient />
    </>
  );
}
