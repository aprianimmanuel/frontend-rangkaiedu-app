import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  TablePagination,
} from '@mui/material';
import {
  Add as AddIcon,
  Save as SaveIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

const BukuNilai = () => {
  const [selectedClass, setSelectedClass] = useState('Pilih Kelas');
  const [selectedSubject, setSelectedSubject] = useState('Pilih Mata Pelajaran');
  const [students, setStudents] = useState([]);
  // Initial columns for grades. 'UTS' and 'UAS' are common.
  const [columns, setColumns] = useState(['UTS', 'UAS']);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Mock data for dropdowns
  const classes = [
    'Pilih Kelas',
    'Kelas 7A',
    'Kelas 7B',
    'Kelas 8A',
    'Kelas 8B',
  ];

  const subjects = [
    'Pilih Mata Pelajaran',
    'Matematika',
    'Bahasa Indonesia',
    'Ilmu Pengetahuan Alam (IPA)',
    'Pendidikan Pancasila dan Kewarganegaraan (PPKn)',
  ];

  // Mock student data with initial grades
  const mockStudents = [
    { id: 1, name: 'Ahmad Santoso', grades: { UTS: 85, UAS: 90 } },
    { id: 2, name: 'Budi Wijaya', grades: { UTS: 78, UAS: 82 } },
    { id: 3, name: 'Citra Dewi', grades: { UTS: 92, UAS: 88 } },
    { id: 4, name: 'Dewi Sartika', grades: { UTS: 76, UAS: 80 } },
    { id: 5, name: 'Eko Prasetyo', grades: { UTS: 89, UAS: 85 } },
    { id: 6, name: 'Fitri Ani', grades: { UTS: 84, UAS: 91 } },
    { id: 7, name: 'Guntur Hadi', grades: { UTS: 70, UAS: 75 } },
    { id: 8, name: 'Hani Lestari', grades: { UTS: 95, UAS: 93 } },
    { id: 9, name: 'Indra Kurnia', grades: { UTS: 81, UAS: 87 } },
    { id: 10, name: 'Joko Widodo', grades: { UTS: 88, UAS: 84 } },
    { id: 11, name: 'Kartika Sari', grades: { UTS: 79, UAS: 83 } },
    { id: 12, name: 'Larasati Putri', grades: { UTS: 86, UAS: 89 } },
  ];

  // Effect to load/filter student data based on selected class and subject
  useEffect(() => {
    if (selectedClass !== 'Pilih Kelas' && selectedSubject !== 'Pilih Mata Pelajaran') {
      // In a real application, you would fetch data from an API here
      // For now, we'll use mock data and ensure all columns are present
      setStudents(mockStudents.map(student => ({
        ...student,
        grades: {
          ...student.grades,
          // Ensure all current columns have a value, default to empty string if not present
          ...columns.reduce((acc, col) => {
            if (!(col in student.grades)) {
              acc[col] = '';
            }
            return acc;
          }, {}),
        },
      })));
      setPage(0); // Reset pagination when data changes
    } else {
      setStudents([]); // Clear students if no class/subject is selected
    }
  }, [selectedClass, selectedSubject, columns]); // Re-run if columns change to update student grade structure

  // Handler to add a new grade column
  const handleAddColumn = () => {
    const newColumn = prompt('Masukkan nama kolom nilai baru (e.g., Tugas 1):');
    if (newColumn && newColumn.trim() !== '' && !columns.includes(newColumn.trim())) {
      const trimmedColumn = newColumn.trim();
      setColumns([...columns, trimmedColumn]);
      // Initialize the new column with empty grades for all students
      setStudents(prevStudents =>
        prevStudents.map(student => ({
          ...student,
          grades: { ...student.grades, [trimmedColumn]: '' },
        }))
      );
      setUnsavedChanges(true);
    } else if (newColumn && newColumn.trim() !== '') {
      alert('Kolom sudah ada atau nama tidak valid.');
    }
  };

  // Placeholder for save logic
  const handleSave = () => {
    console.log('Saving changes...', students);
    alert('Perubahan berhasil disimpan!'); // Simple success feedback
    setUnsavedChanges(false);
  };

  // Handler for grade input changes
  const handleGradeChange = (studentId, column, value) => {
    // Validate input: empty string or number between 0 and 100
    const numValue = value === '' ? '' : Math.max(0, Math.min(100, parseInt(value) || 0));
    setStudents(prevStudents =>
      prevStudents.map(student =>
        student.id === studentId
          ? { ...student, grades: { ...student.grades, [column]: numValue } }
          : student
      )
    );
    setUnsavedChanges(true); // Mark changes as unsaved
  };

  // Helper to calculate average grade
  const calculateAverage = (grades) => {
    // Filter out non-numeric or empty grades for average calculation
    const numericGrades = Object.values(grades).filter(val => typeof val === 'number' && val >= 0);
    return numericGrades.length > 0
      ? Math.round(numericGrades.reduce((sum, grade) => sum + grade, 0) / numericGrades.length)
      : '-'; // Display '-' if no valid grades
  };

  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Apply pagination to students array
  const paginatedStudents = students.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  // Calculate total columns for the empty state message colSpan
  // Fixed columns: No, Nama Siswa, Rata-Rata, Aksi (4 columns) + dynamic grade columns
  const totalColumns = columns.length + 4;

  return (
    <Box sx={{ minHeight: '100vh', minWidth: '100vw', display: 'flex', flexDirection: 'column' }}>
      <Container maxWidth="lg" sx={{ flexGrow: 1, py: 3 }}>
      {/* Page Header */}
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4, fontWeight: 600 }}>
        Buku Nilai
      </Typography>

      {/* Filter/Selector Section */}
      <Paper elevation={1} sx={{ p: 2, mb: 3, borderRadius: 1 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id="class-label">Kelas</InputLabel>
              <Select
                labelId="class-label"
                value={selectedClass}
                label="Kelas"
                onChange={(e) => setSelectedClass(e.target.value)}
                aria-label="Pilih kelas"
              >
                {classes.map((cls) => (
                  <MenuItem key={cls} value={cls}>
                    {cls}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id="subject-label">Mata Pelajaran</InputLabel>
              <Select
                labelId="subject-label"
                value={selectedSubject}
                label="Mata Pelajaran"
                onChange={(e) => setSelectedSubject(e.target.value)}
                aria-label="Pilih mata pelajaran"
              >
                {subjects.map((subj) => (
                  <MenuItem key={subj} value={subj}>
                    {subj}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Action Buttons Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 500 }}>
          Daftar Siswa
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<AddIcon />}
            onClick={handleAddColumn}
            size="medium"
            aria-label="Tambah kolom nilai"
          >
            Tambah Kolom Nilai
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            onClick={handleSave}
            disabled={!unsavedChanges} // Disable save button if no changes
            size="medium"
            aria-label="Simpan perubahan"
          >
            Simpan Perubahan
          </Button>
        </Box>
      </Box>

      {/* Student Grades Table */}
      <Box sx={{ overflowX: 'auto' }}> {/* Enables horizontal scrolling on small screens */}
        <TableContainer component={Paper} sx={{ borderRadius: 1, overflow: 'hidden' }}>
          <Table stickyHeader role="table" aria-label="Tabel buku nilai">
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}>
                    No
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Nama Siswa
                  </Typography>
                </TableCell>
                {columns.map((col) => (
                  <TableCell key={col}>
                    <Typography variant="subtitle2" fontWeight={600}>
                      {col}
                    </Typography>
                  </TableCell>
                ))}
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Rata-Rata
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Aksi
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedStudents.length > 0 ? (
                paginatedStudents.map((student, index) => (
                  <TableRow key={student.id}>
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell>{student.name}</TableCell>
                    {columns.map((col) => (
                      <TableCell key={col}>
                        <TextField
                          type="number"
                          value={student.grades[col] === '' ? '' : student.grades[col]} // Display empty string for empty grades
                          onChange={(e) => handleGradeChange(student.id, col, e.target.value)}
                          size="small"
                          sx={{ width: 80 }}
                          inputProps={{ min: 0, max: 100, step: 1 }} // Numeric input validation
                          error={
                            (typeof student.grades[col] === 'number' && student.grades[col] > 100) ||
                            (typeof student.grades[col] === 'number' && student.grades[col] < 0)
                          }
                          aria-label={`Nilai ${col} untuk ${student.name}`}
                        />
                      </TableCell>
                    ))}
                    <TableCell>{calculateAverage(student.grades)}</TableCell>
                    <TableCell>
                      <IconButton size="small" aria-label="Edit siswa">
                        <EditIcon />
                      </IconButton>
                      <IconButton size="small" aria-label="Hapus siswa">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={totalColumns} align="center">
                    <Typography variant="body1" color="textSecondary">
                      Pilih kelas dan mata pelajaran untuk melihat data.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Table Pagination */}
      {students.length > 0 && (
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={students.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Baris per halaman:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} dari ${count}`}
        />
      )}

      {/* Unsaved Changes Indicator */}
      {unsavedChanges && (
        <Box sx={{ mt: 2, p: 2, bgcolor: 'warning.light', borderRadius: 1 }}>
          <Typography variant="body2" color="warning.main">
            Terdapat perubahan yang belum disimpan.
          </Typography>
        </Box>
      )}
      </Container>
    </Box>
  );
};

export default BukuNilai;
