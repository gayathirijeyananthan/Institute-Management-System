import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import DataTable from '../components/DataTable.jsx';
import Modal from '../components/Modal.jsx';
import PageHeader from '../components/PageHeader.jsx';
import ResourceForm from '../components/ResourceForm.jsx';
import { resourceActions } from '../app/store.js';
import { buildFormData, toDateInput } from '../utils/forms.js';

const required = yup.string().required('Required');

const schemas = {
  centers: yup.object({ centerName: required, location: required }),
  cohorts: yup.object({ cohortName: required, centerId: required, startDate: required, endDate: required, status: required }),
  students: yup.object({
    studentId: required,
    firstName: required,
    lastName: required,
    email: yup.string().email().required(),
    phone: required,
    gender: required,
    dateOfBirth: required,
    address: required,
    cohortId: required,
    centerId: required
  }),
  staff: yup.object({ firstName: required, lastName: required, email: yup.string().email().required(), phone: required, role: required, centerId: required }),
  activities: yup.object({ title: required, description: required, date: required, cohortId: required, centerId: required }),
  attendance: yup.object({ studentId: required, cohortId: required, date: required, status: required }),
  announcements: yup.object({ title: required, message: required }),
  modules: yup.object({ moduleName: required, code: required, cohortId: required, centerId: required, lecturerId: yup.string() }),
  clubs: yup.object({ clubName: required, description: required, centerId: required, coordinatorId: yup.string() }),
  submissions: yup.object({
    title: required,
    notes: yup.string(),
    moduleId: yup.string(),
    activityId: yup.string(),
    cohortId: required,
    centerId: required,
    studentId: yup.string(),
    fileUrl: yup.mixed()
  })
};

const text = (key) => (row) => row[key] || '-';
const refText = (key, fallback) => (row) => row[key]?.[fallback] || '-';
const date = (key) => (row) => (row[key] ? new Date(row[key]).toLocaleDateString() : '-');
const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const fileLink = (row) => {
  if (!row.fileUrl) return '-';
  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const origin = apiBase.replace(/\/api\/?$/, '');
  return (
    <a className="font-semibold text-brand hover:underline" href={`${origin}${row.fileUrl}`} target="_blank" rel="noreferrer" download>
      Download
    </a>
  );
};

const configs = {
  centers: {
    title: 'Centers',
    subtitle: 'Create, edit, delete, and search institute centers.',
    addLabel: 'Create Center',
    writeRoles: ['Institute Admin'],
    columns: [
      { key: 'centerName', label: 'Center', render: text('centerName') },
      { key: 'location', label: 'Location', render: text('location') }
    ],
    fields: [{ name: 'centerName', label: 'Center Name' }, { name: 'location', label: 'Location' }]
  },
  cohorts: {
    title: 'Cohorts',
    subtitle: 'Assign cohorts to centers and maintain their lifecycle status.',
    addLabel: 'Create Cohort',
    writeRoles: ['Institute Admin', 'Center Admin'],
    columns: [
      { key: 'cohortName', label: 'Cohort', render: text('cohortName') },
      { key: 'centerId', label: 'Center', render: refText('centerId', 'centerName') },
      { key: 'status', label: 'Status', render: text('status') },
      { key: 'startDate', label: 'Start', render: date('startDate') },
      { key: 'endDate', label: 'End', render: date('endDate') }
    ],
    fields: [
      { name: 'cohortName', label: 'Cohort Name' },
      { name: 'centerId', label: 'Center', type: 'select', source: 'centers', optionLabel: 'centerName' },
      { name: 'status', label: 'Status', type: 'select', options: ['Active', 'Completed', 'Upcoming'].map((item) => ({ label: item, value: item })) },
      { name: 'startDate', label: 'Start Date', type: 'date' },
      { name: 'endDate', label: 'End Date', type: 'date' }
    ]
  },
  students: {
    title: 'Students',
    subtitle: 'Add students, filter by cohort, and maintain profile information.',
    addLabel: 'Add Student',
    writeRoles: ['Institute Admin', 'Center Admin'],
    fileFields: ['profileImage'],
    columns: [
      { key: 'studentId', label: 'ID', render: text('studentId') },
      { key: 'firstName', label: 'Name', render: (row) => `${row.firstName} ${row.lastName}` },
      { key: 'email', label: 'Email', render: text('email') },
      { key: 'cohortId', label: 'Cohort', render: refText('cohortId', 'cohortName') },
      { key: 'centerId', label: 'Center', render: refText('centerId', 'centerName') }
    ],
    fields: [
      { name: 'studentId', label: 'Student ID' },
      { name: 'firstName', label: 'First Name' },
      { name: 'lastName', label: 'Last Name' },
      { name: 'email', label: 'Email' },
      { name: 'phone', label: 'Phone' },
      { name: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female', 'Other'].map((item) => ({ label: item, value: item })) },
      { name: 'dateOfBirth', label: 'Date of Birth', type: 'date' },
      { name: 'centerId', label: 'Center', type: 'select', source: 'centers', optionLabel: 'centerName' },
      { name: 'cohortId', label: 'Cohort', type: 'select', source: 'cohorts', optionLabel: 'cohortName' },
      { name: 'profileImage', label: 'Profile Image', type: 'file' },
      { name: 'address', label: 'Address', type: 'textarea', full: true }
    ]
  },
  staff: {
    title: 'Staff',
    subtitle: 'Manage instructors and operational staff.',
    addLabel: 'Add Staff',
    writeRoles: ['Institute Admin', 'Center Admin'],
    columns: [
      { key: 'firstName', label: 'Name', render: (row) => `${row.firstName} ${row.lastName}` },
      { key: 'email', label: 'Email', render: text('email') },
      { key: 'role', label: 'Role', render: text('role') },
      { key: 'centerId', label: 'Center', render: refText('centerId', 'centerName') }
    ],
    fields: [
      { name: 'firstName', label: 'First Name' },
      { name: 'lastName', label: 'Last Name' },
      { name: 'email', label: 'Email' },
      { name: 'phone', label: 'Phone' },
      { name: 'role', label: 'Role', type: 'select', options: ['Institute Admin', 'Center Admin', 'Lecturer'].map((item) => ({ label: item, value: item })) },
      { name: 'centerId', label: 'Center', type: 'select', source: 'centers', optionLabel: 'centerName' }
    ]
  },
  activities: {
    title: 'Activities',
    subtitle: 'Schedule and track cohort activities.',
    addLabel: 'Add Activity',
    writeRoles: ['Institute Admin', 'Center Admin'],
    columns: [
      { key: 'title', label: 'Title', render: text('title') },
      { key: 'date', label: 'Date', render: date('date') },
      { key: 'cohortId', label: 'Cohort', render: refText('cohortId', 'cohortName') },
      { key: 'centerId', label: 'Center', render: refText('centerId', 'centerName') }
    ],
    fields: [
      { name: 'title', label: 'Title' },
      { name: 'date', label: 'Date', type: 'date' },
      { name: 'centerId', label: 'Center', type: 'select', source: 'centers', optionLabel: 'centerName' },
      { name: 'cohortId', label: 'Cohort', type: 'select', source: 'cohorts', optionLabel: 'cohortName' },
      { name: 'description', label: 'Description', type: 'textarea', full: true }
    ]
  },
  attendance: {
    title: 'Attendance',
    subtitle: 'Mark and update daily attendance.',
    addLabel: 'Mark Attendance',
    writeRoles: ['Institute Admin', 'Center Admin'],
    columns: [
      { key: 'studentId', label: 'Student', render: (row) => row.studentId ? `${row.studentId.firstName} ${row.studentId.lastName}` : '-' },
      { key: 'cohortId', label: 'Cohort', render: refText('cohortId', 'cohortName') },
      { key: 'date', label: 'Date', render: date('date') },
      { key: 'status', label: 'Status', render: text('status') }
    ],
    fields: [
      { name: 'studentId', label: 'Student', type: 'select', source: 'students', optionLabel: (item) => `${item.studentId} - ${item.firstName} ${item.lastName}` },
      { name: 'cohortId', label: 'Cohort', type: 'select', source: 'cohorts', optionLabel: 'cohortName' },
      { name: 'centerId', label: 'Center', type: 'select', source: 'centers', optionLabel: 'centerName' },
      { name: 'date', label: 'Date', type: 'date' },
      { name: 'status', label: 'Status', type: 'select', options: ['Present', 'Absent', 'Late'].map((item) => ({ label: item, value: item })) }
    ]
  },
  announcements: {
    title: 'Announcements',
    subtitle: 'Create and manage institute-wide announcements.',
    addLabel: 'Create Announcement',
    writeRoles: ['Institute Admin'],
    columns: [
      { key: 'title', label: 'Title', render: text('title') },
      { key: 'message', label: 'Message', render: text('message') },
      { key: 'createdAt', label: 'Created', render: date('createdAt') }
    ],
    fields: [
      { name: 'title', label: 'Title' },
      { name: 'message', label: 'Message', type: 'textarea', full: true }
    ]
  },
  modules: {
    title: 'Modules',
    subtitle: 'Manage center modules and lecturer ownership.',
    addLabel: 'Add Module',
    writeRoles: ['Institute Admin', 'Center Admin'],
    columns: [
      { key: 'code', label: 'Code', render: text('code') },
      { key: 'moduleName', label: 'Module', render: text('moduleName') },
      { key: 'cohortId', label: 'Cohort', render: refText('cohortId', 'cohortName') },
      { key: 'centerId', label: 'Center', render: refText('centerId', 'centerName') },
      { key: 'lecturerId', label: 'Lecturer', render: (row) => row.lecturerId ? `${row.lecturerId.firstName} ${row.lecturerId.lastName}` : '-' }
    ],
    fields: [
      { name: 'moduleName', label: 'Module Name' },
      { name: 'code', label: 'Module Code' },
      { name: 'centerId', label: 'Center', type: 'select', source: 'centers', optionLabel: 'centerName' },
      { name: 'cohortId', label: 'Cohort', type: 'select', source: 'cohorts', optionLabel: 'cohortName' },
      { name: 'lecturerId', label: 'Lecturer', type: 'select', source: 'staff', optionLabel: (item) => `${item.firstName} ${item.lastName}` },
      { name: 'description', label: 'Description', type: 'textarea', full: true }
    ]
  },
  clubs: {
    title: 'Clubs',
    subtitle: 'Manage center clubs and coordinators.',
    addLabel: 'Add Club',
    writeRoles: ['Institute Admin', 'Center Admin'],
    columns: [
      { key: 'clubName', label: 'Club', render: text('clubName') },
      { key: 'description', label: 'Description', render: text('description') },
      { key: 'centerId', label: 'Center', render: refText('centerId', 'centerName') },
      { key: 'coordinatorId', label: 'Coordinator', render: (row) => row.coordinatorId ? `${row.coordinatorId.firstName} ${row.coordinatorId.lastName}` : '-' }
    ],
    fields: [
      { name: 'clubName', label: 'Club Name' },
      { name: 'centerId', label: 'Center', type: 'select', source: 'centers', optionLabel: 'centerName' },
      { name: 'coordinatorId', label: 'Coordinator', type: 'select', source: 'staff', optionLabel: (item) => `${item.firstName} ${item.lastName}` },
      { name: 'description', label: 'Description', type: 'textarea', full: true }
    ]
  },
  submissions: {
    title: 'Submissions',
    subtitle: 'Students upload work; lecturers can review and download submissions.',
    addLabel: 'Add Submission',
    writeRoles: ['Student'],
    fileFields: ['fileUrl'],
    columns: [
      { key: 'title', label: 'Title', render: text('title') },
      { key: 'studentId', label: 'Student', render: (row) => row.studentId ? `${row.studentId.firstName} ${row.studentId.lastName}` : '-' },
      { key: 'moduleId', label: 'Module', render: refText('moduleId', 'moduleName') },
      { key: 'status', label: 'Status', render: text('status') },
      { key: 'fileUrl', label: 'File', render: fileLink }
    ],
    fields: [
      { name: 'title', label: 'Title' },
      { name: 'centerId', label: 'Center', type: 'select', source: 'centers', optionLabel: 'centerName' },
      { name: 'cohortId', label: 'Cohort', type: 'select', source: 'cohorts', optionLabel: 'cohortName' },
      { name: 'moduleId', label: 'Module', type: 'select', source: 'modules', optionLabel: 'moduleName' },
      { name: 'activityId', label: 'Activity', type: 'select', source: 'activities', optionLabel: 'title' },
      { name: 'fileUrl', label: 'Submission File', type: 'file' },
      { name: 'notes', label: 'Notes', type: 'textarea', full: true }
    ]
  },
  institutes: {
    title: 'Institutes',
    subtitle: 'Platform-wide institute overview and operational counts.',
    columns: [
      { key: 'instituteName', label: 'Institute', render: text('instituteName') },
      { key: 'email', label: 'Email', render: text('email') },
      { key: 'phone', label: 'Phone', render: text('phone') },
      { key: 'centers', label: 'Centers', render: (row) => row.totals?.centers ?? 0 },
      { key: 'students', label: 'Students', render: (row) => row.totals?.students ?? 0 },
      { key: 'staff', label: 'Staff', render: (row) => row.totals?.staff ?? 0 }
    ],
    fields: [],
    writeRoles: []
  }
};

function hydrateFields(fields, lookups) {
  return fields.map((field) => {
    if (!field.source) return field;
    const options = (lookups[field.source] || []).map((item) => ({
      value: item._id,
      label: typeof field.optionLabel === 'function' ? field.optionLabel(item) : item[field.optionLabel]
    }));
    return { ...field, options };
  });
}

function defaults(fields, editing) {
  return fields.reduce((acc, field) => {
    const value = editing?.[field.name];
    if (field.type === 'date') acc[field.name] = toDateInput(value);
    else if (field.source) acc[field.name] = value?._id || value || '';
    else acc[field.name] = field.type === 'file' ? undefined : value || '';
    return acc;
  }, {});
}

export default function ResourcePage({ resource }) {
  const config = configs[resource];
  const dispatch = useDispatch();
  const state = useSelector((store) => store[resource]);
  const { user } = useSelector((store) => store.auth);
  const lookups = useSelector((store) => ({
    centers: store.centers.items,
    cohorts: store.cohorts.items,
    students: store.students.items,
    staff: store.staff.items,
    modules: store.modules.items,
    activities: store.activities.items
  }));
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [cohortFilter, setCohortFilter] = useState('');
  const [letterFilter, setLetterFilter] = useState('');
  const [editing, setEditing] = useState(null);
  const [open, setOpen] = useState(false);
  const actions = resourceActions[resource];
  const canWrite = config.writeRoles?.includes(user?.role);

  const fields = useMemo(() => hydrateFields(config.fields, lookups), [config.fields, lookups]);
  const queryParams = useMemo(() => {
    const params = { search, page, limit: 10 };
    if (resource === 'students') {
      if (cohortFilter) params.cohortId = cohortFilter;
      if (letterFilter) params.letter = letterFilter;
    }
    return params;
  }, [cohortFilter, letterFilter, page, resource, search]);

  useEffect(() => {
    setSearch('');
    setPage(1);
    setCohortFilter('');
    setLetterFilter('');
  }, [resource]);

  useEffect(() => {
    dispatch(actions.fetchItems(queryParams));
  }, [dispatch, actions, queryParams]);

  useEffect(() => {
    for (const key of ['centers', 'cohorts', 'students', 'staff', 'modules', 'activities']) {
      if (key !== resource && config.fields.some((field) => field.source === key)) {
        dispatch(resourceActions[key].fetchItems({ limit: 100 }));
      }
    }
  }, [dispatch, resource, config.fields]);

  const submit = async (values) => {
    const payload = config.fileFields ? buildFormData(values, config.fileFields) : values;
    const result = editing
      ? await dispatch(actions.updateItem({ id: editing._id, values: payload }))
      : await dispatch(actions.createItem(payload));

    if (result.type.endsWith('/fulfilled')) {
      toast.success(editing ? 'Record updated' : 'Record created');
      setOpen(false);
      setEditing(null);
      dispatch(actions.fetchItems(queryParams));
    } else {
      toast.error(result.payload);
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this record?')) return;
    const result = await dispatch(actions.deleteItem(id));
    result.type.endsWith('/fulfilled') ? toast.success('Record deleted') : toast.error(result.payload);
  };

  return (
    <div>
      <PageHeader
        title={config.title}
        subtitle={config.subtitle}
        search={search}
        setSearch={(value) => {
          setSearch(value);
          setPage(1);
        }}
        addLabel={config.addLabel}
        onAdd={canWrite ? () => {
          setEditing(null);
          setOpen(true);
        } : null}
      />
      {resource === 'students' && (
        <section className="mb-5 rounded-md border border-line bg-white p-4 shadow-soft">
          <div className="grid gap-4 lg:grid-cols-[minmax(220px,320px)_1fr_auto] lg:items-end">
            <div>
              <label className="label">Filter by Cohort</label>
              <select
                className="input"
                value={cohortFilter}
                onChange={(event) => {
                  setCohortFilter(event.target.value);
                  setPage(1);
                }}
              >
                <option value="">All cohorts</option>
                {lookups.cohorts.map((cohort) => (
                  <option value={cohort._id} key={cohort._id}>
                    {cohort.cohortName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Filter by First Letter</label>
              <div className="flex flex-wrap gap-2">
                {letters.map((letter) => (
                  <button
                    className={`h-9 w-9 rounded-md border text-sm font-semibold transition ${
                      letterFilter === letter ? 'border-brand bg-brand text-white' : 'border-line bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                    type="button"
                    onClick={() => {
                      setLetterFilter(letterFilter === letter ? '' : letter);
                      setPage(1);
                    }}
                    key={letter}
                  >
                    {letter}
                  </button>
                ))}
              </div>
            </div>
            <button
              className="btn-ghost"
              type="button"
              onClick={() => {
                setCohortFilter('');
                setLetterFilter('');
                setSearch('');
                setPage(1);
              }}
            >
              <RotateCcw size={18} />
              Reset
            </button>
          </div>
        </section>
      )}
      <DataTable
        columns={config.columns}
        rows={state.items}
        loading={state.loading}
        canWrite={canWrite}
        onEdit={(row) => { setEditing(row); setOpen(true); }}
        onDelete={remove}
      />
      <div className="mt-4 flex flex-col gap-3 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <span>Showing {state.items.length} of {state.total} records</span>
        <div className="flex items-center gap-2">
          <button className="btn-ghost h-9 px-3" disabled={state.loading || state.page <= 1} onClick={() => setPage((value) => Math.max(value - 1, 1))}>
            <ChevronLeft size={16} />
            Prev
          </button>
          <span className="min-w-24 text-center font-medium text-slate-700">
            Page {state.page} of {state.pages}
          </span>
          <button className="btn-ghost h-9 px-3" disabled={state.loading || state.page >= state.pages} onClick={() => setPage((value) => value + 1)}>
            Next
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
      <Modal title={editing ? `Edit ${config.title}` : config.addLabel} open={open} onClose={() => setOpen(false)}>
        <ResourceForm
          fields={fields}
          schema={schemas[resource]}
          defaults={defaults(fields, editing)}
          onSubmit={submit}
          submitLabel={editing ? 'Save Changes' : 'Create'}
        />
      </Modal>
    </div>
  );
}
