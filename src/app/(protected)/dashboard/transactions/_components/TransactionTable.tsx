"use client";

import React, { useState, useEffect, useMemo } from "react";
import EditItem from "../../_components/EditItem";
import DeleteItem from "../../_components/DeleteItem";
import axios from "axios";
import {
  ColumnDef,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDown, ViewIcon, DownloadIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {GetFormatterForCurrency} from "@/lib/formatNumber";
import { DataTableColumnHeader } from "@/components/data-table/ColumnHeader";
import { download, generateCsv, mkConfig } from "export-to-csv";

// Transaction type definition
export type Transactions = {
  _id: string;
  icon: string;
  amount: number;
  title: string;
  description: string;
  type: string;
  createdAt: Date;
};

// Table column definitions
export const columns: ColumnDef<Transactions>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => (
      <div className="capitalize text-center">{row.getValue("title")}</div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => (
      <div className="text-muted-foreground text-center">
        {new Date(row.getValue("createdAt")).toLocaleDateString()}
      </div>
    ),
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.getValue("type");
      return (
        <div
          className={cn(
            "capitalize rounded-lg text-center p-2",
            type === "income" && "bg-emerald-400/10 text-emerald-500",
            type === "expense" && "bg-red-400/10 text-red-500"
          )}
        >
          {row.getValue("type")}
        </div>
      );
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" />
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "INR",
      }).format(amount);

      return (
        <p className="text-md rounded-lg bg-gray-400/5 p-2 text-center font-medium">
          {formatted}
        </p>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => <RowActions transaction={row.original} />,
  },
];

const csvConfig = mkConfig({
  fieldSeparator: ",",
  decimalSeparator: ".",
  useKeysAsHeaders: true,
});

interface TransactionTableProps {
  from: Date;
  to: Date;
}

const TransactionTable: React.FC<TransactionTableProps> = ({ from, to }) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [transactions, setTransactions] = useState<Transactions[]>([]);

  const userCurrency = "INR";
    const formatter = useMemo(
      () => GetFormatterForCurrency(userCurrency),
      [userCurrency]
    );

  // Fetch transactions whenever the `from` or `to` props change
  useEffect(() => {
    const getTransactions = async () => {
      try {
        const response = await axios.get<Transactions[]>(
          "/api/get-transactions",
          {
            params: {
              fromDate: from.toISOString(),
              toDate: to.toISOString(),
            },
          }
        );
        setTransactions(response.data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    if (from instanceof Date && to instanceof Date) {
      getTransactions();
    }
  }, [from, to]);

  const handleExportCSV = (data: Array<{ 
    type: string; 
    title: string; 
    amount: string; 
    date: string; // Convert Date to string
    description: string; 
  }>) => {
    const formattedData = data.map(item => ({
      ...item,
      date: new Date(item.date).toLocaleDateString(), // Convert Date to readable string
    }));
  
    const csv = generateCsv(csvConfig)(formattedData);
    download(csvConfig)(csv);
  };

  const table = useReactTable({
    data: transactions,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnVisibility,
    },
  });

  return (
    <div className="w-full p-5">
      <div className="flex flex-wrap items-center justify-between py-4">
        <div>
          {/* Filter component */}
        </div>
        <div className="flex items-center justify-between gap-3">

        
        <Button
          variant={"outline"}
          size={"sm"}
          className="ml-auto h-8 lg:flex"
          onClick={() => {
            const data = table.getFilteredRowModel().rows.map((row) => ({
              type: row.original.type,
              title: row.original.title,
              amount: formatter.format(row.original.amount),
              date: row.original.createdAt.toString(),
              description: row.original.description,
            }));
            handleExportCSV(data);
          }}
        >
          <DownloadIcon className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              <ViewIcon />
              View <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TransactionTable;

const RowActions: React.FC<{ transaction: Transactions }> = ({
  transaction,
}) => {
  return (
    <div className="flex items-center justify-evenly">
      <EditItem Info={transaction} refreshData={() => {}} />
      <DeleteItem itemId={transaction._id} type={transaction.type} />
    </div>
  );
};
