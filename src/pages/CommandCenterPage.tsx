import { useState, useEffect, useMemo } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
} from '@tanstack/react-table'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { ChevronDown, ChevronUp, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'

import {
  getApplications,
  updateApplication,
  archiveStaleApplications,
  type Application,
  type ApplicationStatus,
  type ApplicationChecklist,
} from '@/services/applicationService'

// ─── Status config ─────────────────────────────────────────────────────────────

const STATUS_OPTIONS: ApplicationStatus[] = ['Backlog', 'Applied', 'Active', 'Archived']

const STATUS_VARIANT: Record<ApplicationStatus, 'secondary' | 'outline' | 'default' | 'destructive'> = {
  Backlog: 'secondary',
  Applied: 'outline',
  Active: 'default',
  Archived: 'destructive',
}

// ─── Column helper ──────────────────────────────────────────────────────────────

const col = createColumnHelper<Application>()

// ─── Component ─────────────────────────────────────────────────────────────────

export function CommandCenterPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [sorting, setSorting] = useState<SortingState>([])
  const [selectedApp, setSelectedApp] = useState<Application | null>(null)
  const [notesDraft, setNotesDraft] = useState('')
  const [checklistDraft, setChecklistDraft] = useState<ApplicationChecklist>({
    tailor_cv: false,
    tailor_cl: false,
    sent_li: false,
    applied: false,
    response: false,
  })
  const [sheetOpen, setSheetOpen] = useState(false)

  // Load + auto-archive on mount
  useEffect(() => {
    archiveStaleApplications()
    setApplications(getApplications())
  }, [])

  // Derived filtered lists
  const activeApps = useMemo(
    () => applications.filter((a) => a.status !== 'Archived'),
    [applications]
  )
  const archivedApps = useMemo(
    () => applications.filter((a) => a.status === 'Archived'),
    [applications]
  )

  // ── Status change ───────────────────────────────────────────────────────────

  function handleStatusChange(app: Application, newStatus: ApplicationStatus) {
    const updated = updateApplication(app.id, { status: newStatus })
    if (updated) {
      setApplications((prev) => prev.map((a) => (a.id === updated.id ? updated : a)))
    }
  }

  // ── Row click → open Sheet ──────────────────────────────────────────────────

  function handleRowClick(app: Application) {
    setSelectedApp(app)
    setNotesDraft(app.private_notes)
    setChecklistDraft({ ...app.checklist })
    setSheetOpen(true)
  }

  // ── Save notes ──────────────────────────────────────────────────────────────

  function handleSaveNotes() {
    if (!selectedApp) return
    const updated = updateApplication(selectedApp.id, {
      private_notes: notesDraft,
      checklist: checklistDraft,
    })
    if (updated) {
      setApplications((prev) => prev.map((a) => (a.id === updated.id ? updated : a)))
      setSelectedApp(updated)
    }
    setSheetOpen(false)
  }

  // ── Table columns ───────────────────────────────────────────────────────────

  const columns = useMemo(
    () => [
      col.accessor('company', {
        header: 'Company',
        cell: (info) => (
          <span className="font-medium text-foreground">{info.getValue()}</span>
        ),
      }),
      col.accessor('role', {
        header: 'Role',
        cell: (info) => (
          <span className="text-muted-foreground">{info.getValue()}</span>
        ),
      }),
      col.accessor('status', {
        header: 'Status',
        cell: (info) => {
          const app = info.row.original
          const status = info.getValue()
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 gap-1"
                  aria-label={status}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Badge variant={STATUS_VARIANT[status]}>{status}</Badge>
                  <ChevronDown className="size-3 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" onClick={(e) => e.stopPropagation()}>
                {STATUS_OPTIONS.filter((s) => s !== status).map((s) => (
                  <DropdownMenuItem
                    key={s}
                    onSelect={() => handleStatusChange(app, s)}
                    aria-label={s}
                  >
                    <Badge variant={STATUS_VARIANT[s]}>{s}</Badge>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )
        },
      }),
      col.accessor('priority', {
        header: 'Priority',
        cell: (info) => {
          const p = info.getValue()
          return (
            <Badge
              variant="outline"
              className={cn(
                p === 'High' && 'border-destructive text-destructive',
                p === 'Low' && 'text-muted-foreground'
              )}
            >
              {p}
            </Badge>
          )
        },
      }),
      col.accessor('updated_at', {
        header: 'Updated',
        cell: (info) => (
          <span className="text-xs text-muted-foreground">
            {new Date(info.getValue()).toLocaleDateString()}
          </span>
        ),
      }),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  // ── TanStack table instances ────────────────────────────────────────────────

  const activeTable = useReactTable({
    data: activeApps,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  const archivedTable = useReactTable({
    data: archivedApps,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  // ── Render helpers ──────────────────────────────────────────────────────────

  function renderTable(table: typeof activeTable, emptyMessage: string) {
    const rows = table.getRowModel().rows
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((header) => {
                  const canSort = header.column.getCanSort()
                  const sorted = header.column.getIsSorted()
                  return (
                    <TableHead
                      key={header.id}
                      className={cn(canSort && 'cursor-pointer select-none')}
                      onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                    >
                      <div className="flex items-center gap-1">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {canSort && (
                          sorted === 'asc' ? (
                            <ChevronUp className="size-3" />
                          ) : sorted === 'desc' ? (
                            <ChevronDown className="size-3" />
                          ) : (
                            <ChevronsUpDown className="size-3 text-muted-foreground" />
                          )
                        )}
                      </div>
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center text-muted-foreground py-12">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="cursor-pointer"
                  onClick={() => handleRowClick(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    )
  }

  // ── Main render ─────────────────────────────────────────────────────────────

  return (
    <div className="container mx-auto py-8 flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Command Center</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Track and manage your job applications.
        </p>
      </div>

      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active">Active ({activeApps.length})</TabsTrigger>
          <TabsTrigger value="archived">Archived ({archivedApps.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-4">
          {renderTable(activeTable, 'No applications yet. Head to the Forge to create one.')}
        </TabsContent>

        <TabsContent value="archived" className="mt-4">
          {renderTable(archivedTable, 'No archived applications.')}
        </TabsContent>
      </Tabs>

      {/* ── Row Detail Sheet ────────────────────────────────────────────────── */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="flex flex-col gap-0 overflow-y-auto sm:max-w-md">
          <SheetHeader className="pb-4">
            <SheetTitle className="sr-only">Application Details</SheetTitle>
            {selectedApp && (
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-lg leading-none">{selectedApp.role}</span>
                <span className="text-muted-foreground text-sm">{selectedApp.company}</span>
              </div>
            )}
          </SheetHeader>

          <div className="flex flex-col gap-6 flex-1">
            {/* Private Notes */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="private-notes"
                className="text-sm font-medium"
                aria-label="Private Notes"
              >
                Private Notes
              </label>
              <Textarea
                id="private-notes"
                aria-label="Private Notes"
                placeholder="Add insights, contacts, next steps..."
                className="min-h-[140px] resize-none"
                value={notesDraft}
                onChange={(e) => setNotesDraft(e.target.value)}
              />
            </div>

            {/* Task Checklist */}
            <div className="flex flex-col gap-3">
              <span className="text-sm font-medium">Task Checklist</span>
              {(
                [
                  { key: 'tailor_cv', label: 'Tailor CV' },
                  { key: 'tailor_cl', label: 'Tailor CL' },
                  { key: 'sent_li', label: 'Sent LI' },
                  { key: 'applied', label: 'Applied' },
                  { key: 'response', label: 'Response' },
                ] as { key: keyof ApplicationChecklist; label: string }[]
              ).map(({ key, label }) => (
                <div key={key} className="flex items-center gap-2">
                  <Checkbox
                    id={`check-${key}`}
                    aria-label={label}
                    checked={checklistDraft[key]}
                    onCheckedChange={(checked) =>
                      setChecklistDraft((prev) => ({ ...prev, [key]: !!checked }))
                    }
                  />
                  <label
                    htmlFor={`check-${key}`}
                    className="text-sm cursor-pointer select-none"
                  >
                    {label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <SheetFooter className="mt-6">
            <Button
              className="w-full"
              onClick={handleSaveNotes}
              aria-label="Save Notes"
            >
              Save Notes
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}
