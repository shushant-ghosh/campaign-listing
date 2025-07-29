import React, { useState, useRef, useMemo, useCallback } from 'react';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
ModuleRegistry.registerModules([AllCommunityModule]);
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { campaigns } from '../data/campaigns';

const CampaignGrid = () => {
    const gridRef = useRef(null);
    const [rowData, setRowData] = useState(campaigns);
    const [searchText, setSearchText] = useState('');
    const [pageSize, setPageSize] = useState(20);
    const [currentStatus, setCurrentStatus] = useState('');

    const columnDefs = useMemo(() => [
        {
            headerName: 'Campaign ID',
            field: 'campaignId',
            sortable: true,
            filter: true,
            floatingFilter: true
        },
        {
            headerName: 'Campaign Name',
            field: 'campaignName',
            sortable: true,
            filter: true,
            floatingFilter: true
        },
        {
            headerName: 'Client Name',
            field: 'clientName',
            sortable: true,
            filter: true,
            floatingFilter: true
        },
        {
            headerName: 'Start Date',
            field: 'startDate',
            sortable: true,
            floatingFilter: true,
            filter: 'agDateColumnFilter'
        },
        {
            headerName: 'End Date',
            field: 'endDate',
            sortable: true,
            floatingFilter: true,
            filter: 'agDateColumnFilter'
        },
        {
            headerName: 'Status',
            field: 'status',
            filter: 'agSetColumnFilter',
            filterParams: {
                values: ['Draft', 'Scheduled', 'Active', 'Completed', 'Cancelled'],
                suppressMiniFilter: true
            },
            sortable: true
        },
        {
            headerName: 'Budget (USD)',
            field: 'budget',
            floatingFilter: true,
            filter: 'agNumberColumnFilter',
            sortable: true,
        },
        {
            headerName: 'Spent (USD)',
            field: 'spent',
            floatingFilter: true,
            filter: 'agNumberColumnFilter',
            sortable: true,
        },
        {
            headerName: 'Impressions',
            field: 'impressions',
            floatingFilter: true,
            filter: 'agNumberColumnFilter',
            sortable: true,
        },
        {
            headerName: 'Clicks',
            field: 'clicks',
            floatingFilter: true,
            filter: 'agNumberColumnFilter',
            sortable: true,
        },
        {
            headerName: 'Conversion Rate (%)',
            field: 'conversionRate',
            floatingFilter: true,
            filter: 'agNumberColumnFilter',
            valueFormatter: (params) => {
                const clicks = params.data.clicks;
                const impressions = params.data.impressions;

                if (!impressions || impressions === 0) return '0.00%';

                const rate = (clicks / impressions) * 100;
                return `${rate.toFixed(2)}%`;
            },
            sortable: true,
        },
        {
            headerName: 'Channel',
            field: 'channel',
            sortable: true,
            filter: 'agSetColumnFilter',
            floatingFilter: true,
            filterParams: {
                values: ["Email", "Social Media", "Display", "SMS", "Search"],
                suppressMiniFilter: true
            },
        },
        {
            headerName: 'Manager',
            field: 'manager',
            sortable: true,
            filter: true,
            floatingFilter: true,
        },
        {
            headerName: 'Thumbnail',
            field: 'thumbnail',
            cellRenderer: (params) => (
                <img
                    src={params.value}
                    alt="thumbnail"
                    style={{ width: '60px', height: '40px' }}
                />
            ),
            sortable: false,
            filter: false,
        },
        {
            headerName: 'Last Modified',
            field: 'lastModified',
            sortable: true,
            floatingFilter: true,
            filter: 'agDateColumnFilter'
        }
    ], []);

    const defaultColDef = useMemo(() => ({
        resizable: true,
        minWidth: 100,
        editable: true,
    }), []);

    const pageSizeChange = (e) => {
        const newSize = Number(e.target.value);
        setPageSize(newSize);
        gridRef.current.api.paginationSetPageSize(newSize);
    }

    // Search filtering
    const onSearch = useCallback((e) => {
        setSearchText(e.target.value);
        gridRef.current.api.setQuickFilter(e.target.value);
    }, []);

    const changeStatus = (e) => {
        let status = e.target.value
        setCurrentStatus(status)
    }
    const clearStatus = () => {
        setCurrentStatus("")
    }


    // Bulk update example: set status to "Paused"
    const onBulkEdit = (status) => {
  if (!gridRef.current || !gridRef.current.api) {
    window.alert("Grid is not ready");
    return;
  }

  try {
    const selectedNodes = gridRef.current.api.getSelectedNodes();

    if (selectedNodes.length === 0) {
      window.alert("Select a Campaign first");
      return;
    }

    if (!status || status === "") {
      window.alert("Select a status first");
      return;
    }

    selectedNodes.forEach((node) => {
      node.setDataValue("status", status);
    });

    setCurrentStatus("");
    gridRef.current.api.deselectAll(); // ✅ Use api here
  } catch (err) {
    console.error("Bulk edit error:", err);
    window.alert("An unexpected error occurred");
  }
};

    return (
        <div className="container-fluid p-4">
            <div className='d-flex flex-row gap-3 justify-content-center mb-2'>
                <button type="button" class={currentStatus === "" ? "btn btn-secondary disabled" : "btn btn-primary"} onClick={() => onBulkEdit(currentStatus)}>{currentStatus === "" ? "Bulk Edit" : <>Bulk {currentStatus}</>} </button>
                {currentStatus !== "" && <button type='button' className="btn btn-secondary" onClick={clearStatus}>Clear Status</button>}
                <div class="btn-group">
                    <button type="button" class="btn btn-danger dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                        Action
                    </button>
                    <ul className="dropdown-menu">
                        <li><button className="dropdown-item" value="Draft" onClick={changeStatus}>Draft</button></li>
                        <li><button className="dropdown-item" value="Scheduled" onClick={changeStatus}>Scheduled</button></li>
                        <li><button className="dropdown-item" value="Active" onClick={changeStatus}>Active</button></li>
                        <li><button className="dropdown-item" value="Completed" onClick={changeStatus}>Completed</button></li>
                        <li><button className="dropdown-item" value="Cancelled" onClick={changeStatus}>Cancelled</button></li>
                    </ul>
                </div>
            </div>
            <div className="ag-theme-quartz" style={{ height: "85dvh", minWidth: '100%' }}>
                <AgGridReact
                    ref={gridRef}
                    rowData={rowData}
                    columnDefs={columnDefs}
                    rowHeight={60}
                    defaultColDef={defaultColDef}
                    rowSelection="multiple"
                    animateRows={true}
                    pagination={true}
                    paginationPageSize={pageSize}
                    onPaginationChanged={pageSizeChange}

                />
            </div>
        </div>
    );
};

export default CampaignGrid;
