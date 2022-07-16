import { Text, UnstyledButton, useMantineTheme, Table } from "@mantine/core";
import { selectedViewState, useSetSelectedView, ViewContent } from "@store/viewStore";
import { useCallback, useEffect, useMemo } from "react";
import { useRecoilValue } from "recoil";
import { BaseItem, BaseView, RenameInput } from "../BaseView";
import { style } from "./style";
import { createFallDown } from "@util/misc";
import { Cell, Row, useBlockLayout, useResizeColumns, useTable } from "react-table";
import { fileRenameState, fileSelectionState } from "@store/fileSelectionStore";
import { FixedSizeList } from "react-window";
import { useElementSize } from "@mantine/hooks";
import { TransitionWrapper } from "@components/TransitionWrapper";
import { appSettingsStoreState } from "@store/settingsStore";
import prettyBytes from "pretty-bytes";

export function DetailsView({ width, height }: { width: number; height: number }) {
  const selectedView = useRecoilValue(selectedViewState);
  const setSelectedView = useSetSelectedView();
  const { ref, width: refWidth } = useElementSize();
  const appSettings = useRecoilValue(appSettingsStoreState);

  const columns = useMemo(getColumns, []);
  let content: ViewContent[];

  useEffect(() => {
    content = [...selectedView.content];
    // Sort content
    if (selectedView.defaultSort) {
      content.sort(selectedView.defaultSort);
    } else {
      const sort = (previous: ViewContent, current: ViewContent): 1 | -1 =>
        previous.label < current.label ? -1 : 1;

      const folders = content.filter((item) => item.type === "folder");
      folders.sort(sort);
      const files = content.filter((item) => item.type === "file");
      files.sort(sort);
      content = [...folders, ...files];
    }

    setSelectedView({ ...selectedView, content });
  }, [selectedView.path, selectedView.id]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
    {
      // @ts-expect-error
      columns,
      data: selectedView.content,
    },
    useResizeColumns,
    useBlockLayout
  );

  const RenderRow = useCallback(
    ({ index, style }) => {
      const row = rows[index];
      prepareRow(row);
      return (
        <DetailsItem
          key={index}
          rowStyle={style}
          item={row.original}
          index={index}
          max={selectedView.content.length}
          row={row}
        />
      );
    },
    [prepareRow, rows, refWidth, height, selectedView.content]
  );

  return (
    <BaseView width={width} height={height}>
      <Table
        style={{ borderSpacing: 2, borderCollapse: "separate", width: "100%" }}
        {...getTableProps()}
      >
        {
          <div ref={ref}>
            {headerGroups.map((headerGroup) => (
              <div
                {...headerGroup.getHeaderGroupProps()}
                style={{
                  justifyContent: "space-between",
                  display: "flex",
                }}
              >
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps({ style: { flex: 1 } })}>
                    {column.render("Header")}
                  </th>
                ))}
              </div>
            ))}
          </div>
        }
        <div {...getTableBodyProps()}>
          <FixedSizeList
            className="scroll-y-target"
            height={height - 90}
            itemCount={rows.length}
            itemSize={appSettings.itemSize}
            width="100%"
          >
            {RenderRow}
          </FixedSizeList>
        </div>
      </Table>
    </BaseView>
  );
}

function getColumns() {
  const columns = [
    {
      Header: "Name",
      accessor: "label",
      Cell: ({ value }) => (
        <Text
          style={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}
          size="xs"
        >
          {value}
        </Text>
      ),
    },
    {
      Header: "Modification Date",
      accessor: "modificationDate",
      Cell: ({ value }) => (
        <Text
          style={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}
          size="xs"
        >
          {value.toDateString()}
        </Text>
      ),
    },
    {
      Header: "Type",
      accessor: "kind",
      Cell: ({ value }) => (
        <Text
          style={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}
          size="xs"
        >
          {value}
        </Text>
      ),
    },
    {
      Header: "Size",
      accessor: "contentSize",
      Cell: (cell: Cell<ViewContent, any>) => (
        <Text
          style={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}
          size="xs"
        >
          {cell.row.original.type === "file" ? prettyBytes(cell.value) : ""}
        </Text>
      ),
    },
  ];

  return columns;
}

interface ItemProps {
  max: number;
  index: number;
  rowStyle: any;
  row: Row<ViewContent>;
  item: ViewContent;
}

function DetailsItem({ row, item, index, max, rowStyle }: ItemProps) {
  const appSettings = useRecoilValue(appSettingsStoreState);
  const fileSelections = useRecoilValue(fileSelectionState);
  const isSelected = fileSelections.map(selection => selection.path).includes(row.original.path)
  const height = appSettings.itemSize - 10;
  const { classes } = style({ isSelected, height });
  const renamedFile = useRecoilValue(fileRenameState);
  const theme = useMantineTheme();

  const buildCell = useCallback(
    (index: number, cell: Cell<ViewContent, any>) => {
      if (index !== 0) {
        return cell.render("Cell");
      }

      if (renamedFile && renamedFile.path === row.original.path) {
        return (
          <>
            <img src={item.icon as string} className={classes.icon} />
            <RenameInput className={classes.cellInput} value={cell.value} />
          </>
        );
      }

      return (
        <>
          <img src={item.icon as string} className={classes.icon} />
          {cell.render("Cell")}
        </>
      );
    },
    [item, appSettings.itemSize, renamedFile]
  );

  return (
    <TransitionWrapper transition={createFallDown(index, max)} duration={200}>
      {(styles) => (
        <div
          {...row.getRowProps({
            style: {
              ...styles,
              ...rowStyle,
              padding: "1px 0",
              alignItems: "center",
              justifyContent: "space-between",
              paddingRight: 10,
              boxSizing: "border-box",
            },
          })}
        >
          <BaseItem {...item}>
            <UnstyledButton className={classes.row}>
              {row.cells.map((cell, i) => {
                return (
                  <div {...cell.getCellProps()}>
                    <span style={{ display: "flex", gap: theme.spacing.xs, alignItems: "center" }}>
                      {buildCell(i, cell)}
                    </span>
                  </div>
                );
              })}
            </UnstyledButton>
          </BaseItem>
        </div>
      )}
    </TransitionWrapper>
  );
}
