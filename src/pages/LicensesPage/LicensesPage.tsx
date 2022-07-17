import { Title, Stack, Tooltip, Accordion, Group, Badge, ActionIcon } from "@mantine/core";
import { invoke } from "@tauri-apps/api";
import { useCallback } from "react";
import { BrandGit } from "tabler-icons-react";
import { licenses } from "./licenses";

export function LicensesPage() {
  const handleRepoClick = useCallback((e: MouseEvent, link: string) => {
    e.stopPropagation();
    invoke("launch_file", { path: link });
  }, []);

  const buildLabel = useCallback((title: string, license: string, link: string) => {
    return (
      <Group align="center" sx={{ justifyContent: "space-between", alignItems: "center" }}>
        {title}
        <Group sx={(theme) => ({ gap: theme.spacing.sm, alignItems: "center" })}>
          <Tooltip label="Go to repository">
            <ActionIcon onClick={(e) => handleRepoClick(e, link)} color="gray">
              <BrandGit size={20} />
            </ActionIcon>
          </Tooltip>
          <Badge>{license}</Badge>
        </Group>
      </Group>
    );
  }, []);

  return (
    <Stack p="xs">
      <Title
        sx={(theme) => ({
          marginTop: `${theme.spacing.xs}px !important`,
          marginBottom: "0 !important",
        })}
        order={2}
      >
        App Licenses
      </Title>
      <Group>
        <Accordion sx={{ width: "100%" }}>
          {Object.entries(licenses).map((entry) => (
            <Accordion.Item key={entry[0]} label={buildLabel(entry[0], entry[1].type, entry[1].repo)}>
              <div style={{ userSelect: "text" }} dangerouslySetInnerHTML={{ __html: entry[1].license }} />
            </Accordion.Item>
          ))}
        </Accordion>
      </Group>
    </Stack>
  );
}
