import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserLogs, addResult, deleteLogs } from '../../store/calculatorSlice';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Calculator.css';
import DeleteForeverTwoToneIcon from '@mui/icons-material/DeleteForeverTwoTone';
import SearchIcon from '@mui/icons-material/Search';
import Header from '../../Home/Header';
import { Link } from 'react-router-dom';

const CalculatorFour = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [filters, setFilters] = useState({
    id: '',
    expression: '',
    isValid: '',
    output: '',
    createdOn: null,
  });
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const dispatch = useDispatch();
  const logs = useSelector((state) => state.calculator.history);
  const error = useSelector((state) => state.calculator.error);
  const totalLogs = useSelector((state) => state.calculator.totalLogs);

  useEffect(() => {
    dispatch(fetchUserLogs(currentPage));
  }, [dispatch, currentPage]);

  const handleClick = (value) => {
    if (value === 'AC') {
      setInput('');
      setResult('');
    } else if (value === 'DEL') {
      setInput(input.slice(0, -1));
    } else if (value === '=') {
      evaluateExpression();
    } else {
      setInput(input + value);
    }
  };

  const evaluateExpression = async () => {
    try {
      const res = eval(input); // Be cautious with eval; consider using a safer alternative like math.js
      setResult(res);

      // Dispatch addResult to update Redux store
      await dispatch(addResult({ expression: input, isValid: true, output: res })).unwrap();

      // Fetch logs again to ensure the UI reflects the latest data
      dispatch(fetchUserLogs(currentPage));
    } catch (error) {
      setResult('Error');
      console.error('Error evaluating expression:', error);
    }
  };

  const applyFilters = () => {
    setCurrentPage(1); // Reset to first page when filters are applied
  };

  const handleFilterChange = (e, key) => {
    const value = e.target.value;
    setFilters(prevFilters => ({ ...prevFilters, [key]: value }));
  };

  const handleDateChange = (date) => {
    setFilters(prevFilters => ({ ...prevFilters, createdOn: date }));
  };

  const handleCheckboxChange = (id) => {
    setSelectedIds(prevIds =>
      prevIds.includes(id)
        ? prevIds.filter(selectedId => selectedId !== id)
        : [...prevIds, id]
    );
  };

  const handleSelectAllChange = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      setSelectedIds(filteredLogs.map(log => log._id));
    } else {
      setSelectedIds([]);
    }
  };

  const deleteSelectedLogs = () => {
    if (selectedIds.length > 0) {
      dispatch(deleteLogs(selectedIds));
    }
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const getPaginationButtons = () => {
    const pageNumbers = [];
    const totalPages = Math.ceil(totalLogs / rowsPerPage);

    const maxPagesToShow = 3;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      let startPage, endPage;

      if (currentPage <= Math.ceil(maxPagesToShow / 2)) {
        startPage = 1;
        endPage = maxPagesToShow;
      } else if (currentPage + Math.floor(maxPagesToShow / 2) >= totalPages) {
        startPage = totalPages - maxPagesToShow + 1;
        endPage = totalPages;
      } else {
        startPage = currentPage - Math.floor(maxPagesToShow / 2);
        endPage = currentPage + Math.floor(maxPagesToShow / 2);
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
    }

    return pageNumbers;
  };

  const filteredLogs = logs.filter(log => {
    if (!log) return false; // Ensure log is defined
    if (filters.id && !log._id.toString().includes(filters.id)) return false;
    if (filters.expression && !log.expression.includes(filters.expression)) return false;
    if (filters.isValid && log.isValid.toString() !== filters.isValid) return false;
    if (filters.output && !log.output.toString().includes(filters.output)) return false;
    if (filters.createdOn && new Date(log.createdOn).toLocaleDateString() !== filters.createdOn.toLocaleDateString()) return false;
    return true;
  });

  const paginatedLogs = filteredLogs.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  return (
    <>
      <Header/>
      {/* <div>
              <div><Link to="/profile" className='header-nav-link' style={{color:'black',}}>Profile</Link></div>
      </div> */}
        <div id='main' style={{marginTop:'20px'}}>
      <div className="calculator">
        <div className="display">
          <input className='input' type="text" value={input} placeholder="0" readOnly />
          <div id="resultBox" className="result">{result}</div>
        </div>
        <div className="keypad">
          <div>
            <button className="operator btnnumber" onClick={() => handleClick('AC')}>AC</button>
            <button className="operator btnnumber" onClick={() => handleClick('%')}>%</button>
            <button className="operator btnnumber" onClick={() => handleClick('DEL')}>DEL</button>
            <button className="operator btnnumber" onClick={() => handleClick('/')}>&divide;</button>
          </div>
          <div>
            <button className="btnnumber" onClick={() => handleClick('7')}>7</button>
            <button className="btnnumber" onClick={() => handleClick('8')}>8</button>
            <button className="btnnumber" onClick={() => handleClick('9')}>9</button>
            <button className="operator btnnumber" onClick={() => handleClick('*')}>&times;</button>
          </div>
          <div>
            <button className="btnnumber" onClick={() => handleClick('4')}>4</button>
            <button className="btnnumber" onClick={() => handleClick('5')}>5</button>
            <button className="btnnumber" onClick={() => handleClick('6')}>6</button>
            <button className="operator btnnumber" onClick={() => handleClick('-')}>&ndash;</button>
          </div>
          <div>
            <button className="btnnumber" onClick={() => handleClick('1')}>1</button>
            <button className="btnnumber" onClick={() => handleClick('2')}>2</button>
            <button className="btnnumber" onClick={() => handleClick('3')}>3</button>
            <button className="operator btnnumber" onClick={() => handleClick('+')}>+</button>
          </div>
          <div>
          <button className="btnnumber zero" onClick={() => handleClick('00')}>00</button>
            <button className="btnnumber zero" onClick={() => handleClick('0')}>0</button>
            <button className="btnnumber" onClick={() => handleClick('.')}>.</button>
            <button className="btnnumber" onClick={() => handleClick('=')}>=</button>
          </div>
        </div>
      </div>
      <div className="logs-container">
        <button className="delete-button" onClick={deleteSelectedLogs}>
          <DeleteForeverTwoToneIcon /> Delete Selected
        </button>
        <table>
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAllChange}
                />
              </th>
              <th>ID
                <input
                  type="text"
                  value={filters.id}
                  onChange={(e) => handleFilterChange(e, 'id')}
                  placeholder="Search ID"
                />
                <SearchIcon />
              </th>
              <th>Expression
                <input
                  type="text"
                  value={filters.expression}
                  onChange={(e) => handleFilterChange(e, 'expression')}
                  placeholder="Search Expression"
                />
                <SearchIcon />
              </th>
              <th>Is Valid
                <select
                  value={filters.isValid}
                  onChange={(e) => handleFilterChange(e, 'isValid')}
                >
                  <option value="">All</option>
                  <option value="true">True</option>
                  <option value="false">False</option>
                </select>
              </th>
              <th>Output
                <input
                  type="text"
                  value={filters.output}
                  onChange={(e) => handleFilterChange(e, 'output')}
                  placeholder="Search Output"
                />
                <SearchIcon />
              </th>
              <th>Created On
                <DatePicker
                  selected={filters.createdOn}
                  onChange={handleDateChange}
                  dateFormat="yyyy/MM/dd"
                  placeholderText="Select Date"
                />
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedLogs.map((log, index) => (
              <tr key={log._id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(log._id)}
                    onChange={() => handleCheckboxChange(log._id)}
                  />
                </td>
                {/* <td>{log._id}</td> */}
                <td>{index + 1}</td>
                <td>{log.expression}</td>
                <td>{log.isValid ? 'True' : 'False'}</td>
                <td>{log.output}</td>
                <td>{new Date(log.createdOn).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="pagination">
        {getPaginationButtons().map((number) => (
          <button
            key={number}
            onClick={() => handlePageClick(number)}
            className={currentPage === number ? 'active' : ''}
          >
            {number}
          </button>
        ))}
      </div>
      {error && <div className="error">{error}</div>}
    </div>
    </>

  );
};

export default CalculatorFour;
// import React, { useState, useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { fetchUserLogs, addResult, deleteLogs } from '../../store/calculatorSlice';
// import axios from 'axios';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import './Calculator.css';
// import DeleteForeverTwoToneIcon from '@mui/icons-material/DeleteForeverTwoTone';
// import SearchIcon from '@mui/icons-material/Search';

// const CalculatorFour = () => {
//   const [input, setInput] = useState('');
//   const [result, setResult] = useState('');
//   const [filters, setFilters] = useState({
//     id: '',
//     expression: '',
//     isValid: '',
//     output: '',
//     createdOn: null,
//   });
//   const [selectedIds, setSelectedIds] = useState([]);
//   const [selectAll, setSelectAll] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const rowsPerPage = 10;

//   const dispatch = useDispatch();
//   const logs = useSelector((state) => state.calculator.history);
//   const error = useSelector((state) => state.calculator.error);
//   const totalLogs = useSelector((state) => state.calculator.totalLogs);

//   useEffect(() => {
//     dispatch(fetchUserLogs());
//   }, [dispatch]);

//   const handleClick = (value) => {
//     if (value === 'AC') {
//       setInput('');
//       setResult('');
//     } else if (value === 'DEL') {
//       setInput(input.slice(0, -1));
//     } else if (value === '=') {
//       evaluateExpression();
//     } else {
//       setInput(input + value);
//     }
//   };

//   const evaluateExpression = async () => {
//     try {
//       const res = eval(input); // Be cautious with eval; consider using a safer alternative like math.js
//       setResult(res);

//       // Dispatch addResult to update Redux store
//       await dispatch(addResult({ expression: input, isValid: true, output: res })).unwrap();

//       // Optionally, you could also fetch logs again to ensure the UI reflects the latest data
//       dispatch(fetchUserLogs());
//     } catch (error) {
//       setResult('Error');
//       console.error('Error evaluating expression:', error);
//     }
//   };

//   const applyFilters = (logsToFilter) => {
//     let filtered = logsToFilter;
    
//     if (filters.id) {
//       filtered = filtered.filter(log => log.id.toString().includes(filters.id));
//     }
//     if (filters.expression) {
//       filtered = filtered.filter(log => log.expression.includes(filters.expression));
//     }
//     if (filters.isValid) {
//       filtered = filtered.filter(log => log.isValid.toString() === filters.isValid);
//     }
//     if (filters.output) {
//       filtered = filtered.filter(log => log.output.toString().includes(filters.output));
//     }
//     if (filters.createdOn) {
//       const selectedDate = filters.createdOn.toLocaleDateString();
//       filtered = filtered.filter(log => new Date(log.createdOn).toLocaleDateString() === selectedDate);
//     }
    
//     setFilteredLogs(filtered);
//     setCurrentPage(1);
//   };

//   const handleFilterChange = (e, key) => {
//     const value = e.target.value;
//     setFilters(prevFilters => ({ ...prevFilters, [key]: value }));
//   };

//   const handleDateChange = (date) => {
//     setFilters(prevFilters => ({ ...prevFilters, createdOn: date }));
//   };

//   const handleCheckboxChange = (id) => {
//     setSelectedIds(prevIds =>
//       prevIds.includes(id)
//         ? prevIds.filter(selectedId => selectedId !== id)
//         : [...prevIds, id]
//     );
//   };

//   const handleSelectAllChange = () => {
//     setSelectAll(!selectAll);
//     if (!selectAll) {
//       setSelectedIds(filteredLogs.map(log => log.id));
//     } else {
//       setSelectedIds([]);
//     }
//   };

//   const deleteSelectedLogs = () => {
//     if (selectedIds.length > 0) {
//       dispatch(deleteLogs(selectedIds));
//     }
//   };

//   const handlePageClick = (pageNumber) => {
//     setCurrentPage(pageNumber);
//   };

//   const getPaginationButtons = () => {
//     const pageNumbers = [];
//     const totalPages = Math.ceil(filteredLogs.length / rowsPerPage);

//     const maxPagesToShow = 3;

//     if (totalPages <= maxPagesToShow) {
//       for (let i = 1; i <= totalPages; i++) {
//         pageNumbers.push(i);
//       }
//     } else {
//       let startPage, endPage;

//       if (currentPage <= Math.ceil(maxPagesToShow / 2)) {
//         startPage = 1;
//         endPage = maxPagesToShow;
//       } else if (currentPage + Math.floor(maxPagesToShow / 2) >= totalPages) {
//         startPage = totalPages - maxPagesToShow + 1;
//         endPage = totalPages;
//       } else {
//         startPage = currentPage - Math.floor(maxPagesToShow / 2);
//         endPage = currentPage + Math.floor(maxPagesToShow / 2);
//       }

//       for (let i = startPage; i <= endPage; i++) {
//         pageNumbers.push(i);
//       }
//     }

//     return pageNumbers;
//   };

//   const filteredLogs = logs.filter(log => {
//     if (filters.id && !log.id.toString().includes(filters.id)) return false;
//     if (filters.expression && !log.expression.includes(filters.expression)) return false;
//     if (filters.isValid && log.isValid.toString() !== filters.isValid) return false;
//     if (filters.output && !log.output.toString().includes(filters.output)) return false;
//     if (filters.createdOn && new Date(log.createdOn).toLocaleDateString() !== filters.createdOn.toLocaleDateString()) return false;
//     return true;
//   });

//   const paginatedLogs = filteredLogs.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

//   return (
//     <div id='main'>
//       <div className="calculator">
//         <div className="display">
//           <input className='input' type="text" value={input} placeholder="0" readOnly />
//           <div id="resultBox" className="result">{result}</div>
//         </div>
//         <div className="keypad">
//           <div>
//             <button className="operator btnnumber" onClick={() => handleClick('AC')}>AC</button>
//             <button className="operator btnnumber" onClick={() => handleClick('%')}>%</button>
//             <button className="operator btnnumber" onClick={() => handleClick('DEL')}>DEL</button>
//             <button className="operator btnnumber" onClick={() => handleClick('/')}>&divide;</button>
//           </div>
//           <div>
//             <button className="btnnumber" onClick={() => handleClick('7')}>7</button>
//             <button className="btnnumber" onClick={() => handleClick('8')}>8</button>
//             <button className="btnnumber" onClick={() => handleClick('9')}>9</button>
//             <button className="operator btnnumber" onClick={() => handleClick('*')}>&times;</button>
//           </div>
//           <div>
//             <button className="btnnumber" onClick={() => handleClick('4')}>4</button>
//             <button className="btnnumber" onClick={() => handleClick('5')}>5</button>
//             <button className="btnnumber" onClick={() => handleClick('6')}>6</button>
//             <button className="operator btnnumber" onClick={() => handleClick('-')}>&ndash;</button>
//           </div>
//           <div>
//             <button className="btnnumber" onClick={() => handleClick('1')}>1</button>
//             <button className="btnnumber" onClick={() => handleClick('2')}>2</button>
//             <button className="btnnumber" onClick={() => handleClick('3')}>3</button>
//             <button className="operator btnnumber" onClick={() => handleClick('+')}>+</button>
//           </div>
//           <div>
//             <button className="btnnumber zero" onClick={() => handleClick('0')}>0</button>
//             <button className="btnnumber" onClick={() => handleClick('.')}>.</button>
//             <button className="btnnumber" onClick={() => handleClick('=')}>=</button>
//           </div>
//         </div>
//       </div>
//       <div className="logs-container">
//         <button className="delete-button" onClick={deleteSelectedLogs}>
//           <DeleteForeverTwoToneIcon /> Delete Selected
//         </button>
//         <table>
//           <thead>
//             <tr>
//               <th>
//                 <input
//                   type="checkbox"
//                   checked={selectAll}
//                   onChange={handleSelectAllChange}
//                 />
//               </th>
//               <th>ID
//                 <input
//                   type="text"
//                   value={filters.id}
//                   onChange={(e) => handleFilterChange(e, 'id')}
//                   placeholder="Search ID"
//                 />
//                 <SearchIcon />
//               </th>
//               <th>Expression
//                 <input
//                   type="text"
//                   value={filters.expression}
//                   onChange={(e) => handleFilterChange(e, 'expression')}
//                   placeholder="Search Expression"
//                 />
//                 <SearchIcon />
//               </th>
//               <th>Is Valid
//                 <select
//                   value={filters.isValid}
//                   onChange={(e) => handleFilterChange(e, 'isValid')}
//                 >
//                   <option value="">All</option>
//                   <option value="true">True</option>
//                   <option value="false">False</option>
//                 </select>
//               </th>
//               <th>Output
//                 <input
//                   type="text"
//                   value={filters.output}
//                   onChange={(e) => handleFilterChange(e, 'output')}
//                   placeholder="Search Output"
//                 />
//                 <SearchIcon />
//               </th>
//               <th>Created On
//                 <DatePicker
//                   selected={filters.createdOn}
//                   onChange={handleDateChange}
//                   dateFormat="yyyy/MM/dd"
//                   placeholderText="Select Date"
//                 />
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             {paginatedLogs.map((log) => (
//               <tr key={log.id}>
//                 <td>
//                   <input
//                     type="checkbox"
//                     checked={selectedIds.includes(log.id)}
//                     onChange={() => handleCheckboxChange(log.id)}
//                   />
//                 </td>
//                 <td>{log.id}</td>
//                 <td>{log.expression}</td>
//                 <td>{log.isValid.toString()}</td>
//                 <td>{log.output}</td>
//                 <td>{new Date(log.createdOn).toLocaleDateString()}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//       <div className="pagination">
//         {getPaginationButtons().map((number) => (
//           <button
//             key={number}
//             onClick={() => handlePageClick(number)}
//             className={currentPage === number ? 'active' : ''}
//           >
//             {number}
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default CalculatorFour;

// import React, { useState, useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { fetchUserLogs, addResult, deleteLogs } from '../../store/calculatorSlice';
// import axios from 'axios';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import './Calculator.css';
// import DeleteForeverTwoToneIcon from '@mui/icons-material/DeleteForeverTwoTone';
// import SearchIcon from '@mui/icons-material/Search';

// const CalculatorFour = () => {
//   const [input, setInput] = useState('');
//   const [result, setResult] = useState('');
//   const [filters, setFilters] = useState({
//     id: '',
//     expression: '',
//     isValid: '',
//     output: '',
//     createdOn: null,
//   });
//   const [selectedIds, setSelectedIds] = useState([]);
//   const [selectAll, setSelectAll] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const rowsPerPage = 10;

//   const dispatch = useDispatch();
//   const logs = useSelector((state) => state.calculator.history);
//   const error = useSelector((state) => state.calculator.error);
//   const totalLogs = useSelector((state) => state.calculator.totalLogs);

//   useEffect(() => {
//     dispatch(fetchUserLogs());
//   }, [dispatch]);

//   const handleClick = (value) => {
//     if (value === 'AC') {
//       setInput('');
//       setResult('');
//     } else if (value === 'DEL') {
//       setInput(input.slice(0, -1));
//     } else if (value === '=') {
//       evaluateExpression();
//     } else {
//       setInput(input + value);
//     }
//   };

//   const evaluateExpression = async () => {
//     try {
//       const res = eval(input); // Be cautious with eval, consider safer alternatives
//       setResult(res);
//       dispatch(addResult({ expression: input, isValid: true, output: res }));
//       await axios.post('http://localhost:5000/calculations/logs', {
//         expression: input,
//         isValid: true,
//         output: res,
//       });
//       dispatch(fetchUserLogs());
//     } catch (error) {
//       setResult('Error');
//     }
//   };

//   const applyFilters = (logsToFilter) => {
//     let filtered = logsToFilter;
    
//     if (filters.id) {
//       filtered = filtered.filter(log => log.id.toString().includes(filters.id));
//     }
//     if (filters.expression) {
//       filtered = filtered.filter(log => log.expression.includes(filters.expression));
//     }
//     if (filters.isValid) {
//       filtered = filtered.filter(log => log.isValid.toString() === filters.isValid);
//     }
//     if (filters.output) {
//       filtered = filtered.filter(log => log.output.toString().includes(filters.output));
//     }
//     if (filters.createdOn) {
//       const selectedDate = filters.createdOn.toLocaleDateString();
//       filtered = filtered.filter(log => new Date(log.createdOn).toLocaleDateString() === selectedDate);
//     }
    
//     setFilteredLogs(filtered);
//     setCurrentPage(1);
//   };

//   const handleFilterChange = (e, key) => {
//     const value = e.target.value;
//     setFilters(prevFilters => ({ ...prevFilters, [key]: value }));
//   };

//   const handleDateChange = (date) => {
//     setFilters(prevFilters => ({ ...prevFilters, createdOn: date }));
//   };

//   const handleCheckboxChange = (id) => {
//     if (selectedIds.includes(id)) {
//       setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
//     } else {
//       setSelectedIds([...selectedIds, id]);
//     }
//   };

//   const handleSelectAllChange = () => {
//     setSelectAll(!selectAll);
//     if (!selectAll) {
//       setSelectedIds(filteredLogs.map(log => log.id));
//     } else {
//       setSelectedIds([]);
//     }
//   };

//   const deleteSelectedLogs = () => {
//     dispatch(deleteLogs(selectedIds));
//   };

//   const handlePageClick = (pageNumber) => {
//     setCurrentPage(pageNumber);
//   };

//   const getPaginationButtons = () => {
//     const pageNumbers = [];
//     const totalPages = Math.ceil(filteredLogs.length / rowsPerPage); // Define totalPages here

//     const maxPagesToShow = 3;

//     if (totalPages <= maxPagesToShow) {
//       for (let i = 1; i <= totalPages; i++) {
//         pageNumbers.push(i);
//       }
//     } else {
//       let startPage, endPage;

//       if (currentPage <= Math.ceil(maxPagesToShow / 2)) {
//         startPage = 1;
//         endPage = maxPagesToShow;
//       } else if (currentPage + Math.floor(maxPagesToShow / 2) >= totalPages) {
//         startPage = totalPages - maxPagesToShow + 1;
//         endPage = totalPages;
//       } else {
//         startPage = currentPage - Math.floor(maxPagesToShow / 2);
//         endPage = currentPage + Math.floor(maxPagesToShow / 2);
//       }

//       for (let i = startPage; i <= endPage; i++) {
//         pageNumbers.push(i);
//       }
//     }

//     return pageNumbers;
//   };

//   const filteredLogs = logs.filter(log => {
//     if (filters.id && !log.id.toString().includes(filters.id)) return false;
//     if (filters.expression && !log.expression.includes(filters.expression)) return false;
//     if (filters.isValid && log.isValid.toString() !== filters.isValid) return false;
//     if (filters.output && !log.output.toString().includes(filters.output)) return false;
//     if (filters.createdOn && new Date(log.createdOn).toLocaleDateString() !== filters.createdOn.toLocaleDateString()) return false;
//     return true;
//   });

//   const paginatedLogs = filteredLogs.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

//   return (
//     <div id='main'>
//       <div className="calculator">
//         <div className="display">
//           <input className='input' type="text" value={input} placeholder="0" readOnly />
//           <div id="resultBox" className="result">{result}</div>
//         </div>
//         <div className="keypad">
//           <div>
//             <button className="operator btnnumber" onClick={() => handleClick('AC')}>AC</button>
//             <button className="operator btnnumber" onClick={() => handleClick('%')}>%</button>
//             <button className="operator btnnumber" onClick={() => handleClick('DEL')}>DEL</button>
//             <button className="operator btnnumber" onClick={() => handleClick('/')}>&divide;</button>
//           </div>
//           <div>
//             <button className="btnnumber" onClick={() => handleClick('7')}>7</button>
//             <button className="btnnumber" onClick={() => handleClick('8')}>8</button>
//             <button className="btnnumber" onClick={() => handleClick('9')}>9</button>
//             <button className="operator btnnumber" onClick={() => handleClick('*')}>&times;</button>
//           </div>
//           <div>
//             <button className="btnnumber" onClick={() => handleClick('4')}>4</button>
//             <button className="btnnumber" onClick={() => handleClick('5')}>5</button>
//             <button className="btnnumber" onClick={() => handleClick('6')}>6</button>
//             <button className="operator btnnumber" onClick={() => handleClick('-')}>&ndash;</button>
//           </div>
//           <div>
//             <button className="btnnumber" onClick={() => handleClick('1')}>1</button>
//             <button className="btnnumber" onClick={() => handleClick('2')}>2</button>
//             <button className="btnnumber" onClick={() => handleClick('3')}>3</button>
//             <button className="operator btnnumber" onClick={() => handleClick('+')}>+</button>
//           </div>
//           <div>
//             <button className="btnnumber zero" onClick={() => handleClick('0')}>0</button>
//             <button className="btnnumber" onClick={() => handleClick('.')}>.</button>
//             <button className="btnnumber" onClick={() => handleClick('=')}>=</button>
//           </div>
//         </div>
//       </div>
//       <div className="logs-container">
//         <button className="delete-button" onClick={deleteSelectedLogs}>
//           <DeleteForeverTwoToneIcon /> Delete Selected
//         </button>
//         <table>
//           <thead>
//             <tr>
//               <th>
//                 <input
//                   type="checkbox"
//                   checked={selectAll}
//                   onChange={handleSelectAllChange}
//                 />
//               </th>
//               <th>ID
//                 <input
//                   type="text"
//                   value={filters.id}
//                   onChange={(e) => handleFilterChange(e, 'id')}
//                   placeholder="Search ID"
//                 />
//                 <SearchIcon />
//               </th>
//               <th>Expression
//                 <input
//                   type="text"
//                   value={filters.expression}
//                   onChange={(e) => handleFilterChange(e, 'expression')}
//                   placeholder="Search Expression"
//                 />
//                 <SearchIcon />
//               </th>
//               <th>Is Valid
//                 <select
//                   value={filters.isValid}
//                   onChange={(e) => handleFilterChange(e, 'isValid')}
//                 >
//                   <option value="">All</option>
//                   <option value="true">True</option>
//                   <option value="false">False</option>
//                 </select>
//               </th>
//               <th>Output
//                 <input
//                   type="text"
//                   value={filters.output}
//                   onChange={(e) => handleFilterChange(e, 'output')}
//                   placeholder="Search Output"
//                 />
//                 <SearchIcon />
//               </th>
//               <th>Created On
//                 <DatePicker
//                   selected={filters.createdOn}
//                   onChange={handleDateChange}
//                   dateFormat="yyyy/MM/dd"
//                   placeholderText="Select Date"
//                 />
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             {paginatedLogs.map((log) => (
//               <tr key={log.id}>
//                 <td>
//                   <input
//                     type="checkbox"
//                     checked={selectedIds.includes(log.id)}
//                     onChange={() => handleCheckboxChange(log.id)}
//                   />
//                 </td>
//                 <td>{log.id}</td>
//                 <td>{log.expression}</td>
//                 <td>{log.isValid.toString()}</td>
//                 <td>{log.output}</td>
//                 <td>{new Date(log.createdOn).toLocaleDateString()}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//       <div className="pagination">
//         {getPaginationButtons().map((number) => (
//           <button
//             key={number}
//             onClick={() => handlePageClick(number)}
//             className={currentPage === number ? 'active' : ''}
//           >
//             {number}
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default CalculatorFour;

// // import React, { useState, useEffect } from 'react';
// // import { useSelector, useDispatch } from 'react-redux';
// // // import { fetchUserLogs, addResult, deleteLogs } from './calculatorSlice';
// // import { fetchUserLogs, addResult, deleteLogs } from '../../store/calculatorSlice';
// // import axios from 'axios';
// // import DatePicker from 'react-datepicker';
// // import 'react-datepicker/dist/react-datepicker.css';
// // import './Calculator.css';
// // import DeleteForeverTwoToneIcon from '@mui/icons-material/DeleteForeverTwoTone';
// // import SearchIcon from '@mui/icons-material/Search';

// // const CalculatorFour = () => {
// //   const [input, setInput] = useState('');
// //   const [result, setResult] = useState('');
// //   const [filters, setFilters] = useState({
// //     id: '',
// //     expression: '',
// //     isValid: '',
// //     output: '',
// //     createdOn: null,
// //   });
// //   const [selectedIds, setSelectedIds] = useState([]);
// //   const [selectAll, setSelectAll] = useState(false);
// //   const [currentPage, setCurrentPage] = useState(1);
// //   const rowsPerPage = 10;

// //   const dispatch = useDispatch();
// //   const logs = useSelector((state) => state.calculator.history);
// //   const error = useSelector((state) => state.calculator.error);
// //   const totalLogs = useSelector((state) => state.calculator.totalLogs);

// //   useEffect(() => {
// //     dispatch(fetchUserLogs());
// //   }, [dispatch]);

// //   const handleClick = (value) => {
// //     if (value === 'AC') {
// //       setInput('');
// //       setResult('');
// //     } else if (value === 'DEL') {
// //       setInput(input.slice(0, -1));
// //     } else if (value === '=') {
// //       evaluateExpression();
// //     } else {
// //       setInput(input + value);
// //     }
// //   };

// //   const evaluateExpression = async () => {
// //     try {
// //       const res = eval(input); // Be cautious with eval, consider safer alternatives
// //       setResult(res);
// //       dispatch(addResult({ expression: input, isValid: true, output: res }));
// //       await axios.post('http://localhost:5000/calculations/logs', {
// //         expression: input,
// //         isValid: true,
// //         output: res,
// //       });
// //       dispatch(fetchUserLogs());
// //     } catch (error) {
// //       setResult('Error');
// //     }
// //   };

// //   const applyFilters = (logsToFilter) => {
// //     let filtered = logsToFilter;
    
// //     if (filters.id) {
// //       filtered = filtered.filter(log => log.id.toString().includes(filters.id));
// //     }
// //     if (filters.expression) {
// //       filtered = filtered.filter(log => log.expression.includes(filters.expression));
// //     }
// //     if (filters.isValid) {
// //       filtered = filtered.filter(log => log.isValid.toString() === filters.isValid);
// //     }
// //     if (filters.output) {
// //       filtered = filtered.filter(log => log.output.toString().includes(filters.output));
// //     }
// //     if (filters.createdOn) {
// //       const selectedDate = filters.createdOn.toLocaleDateString();
// //       filtered = filtered.filter(log => new Date(log.createdOn).toLocaleDateString() === selectedDate);
// //     }
    
// //     setFilteredLogs(filtered);
// //     setTotalPages(Math.ceil(filtered.length / rowsPerPage));
// //     setCurrentPage(1);
// //   };

// //   const handleFilterChange = (e, key) => {
// //     const value = e.target.value;
// //     setFilters(prevFilters => ({ ...prevFilters, [key]: value }));
// //   };

// //   const handleDateChange = (date) => {
// //     setFilters(prevFilters => ({ ...prevFilters, createdOn: date }));
// //   };

// //   const handleCheckboxChange = (id) => {
// //     if (selectedIds.includes(id)) {
// //       setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
// //     } else {
// //       setSelectedIds([...selectedIds, id]);
// //     }
// //   };

// //   const handleSelectAllChange = () => {
// //     setSelectAll(!selectAll);
// //     if (!selectAll) {
// //       setSelectedIds(filteredLogs.map(log => log.id));
// //     } else {
// //       setSelectedIds([]);
// //     }
// //   };

// //   const deleteSelectedLogs = () => {
// //     dispatch(deleteLogs(selectedIds));
// //   };

// //   const handlePageClick = (pageNumber) => {
// //     setCurrentPage(pageNumber);
// //   };

// //   const getPaginationButtons = () => {
// //     const pageNumbers = [];
// //     const maxPagesToShow = 3;

// //     if (totalPages <= maxPagesToShow) {
// //       for (let i = 1; i <= totalPages; i++) {
// //         pageNumbers.push(i);
// //       }
// //     } else {
// //       let startPage, endPage;

// //       if (currentPage <= Math.ceil(maxPagesToShow / 2)) {
// //         startPage = 1;
// //         endPage = maxPagesToShow;
// //       } else if (currentPage + Math.floor(maxPagesToShow / 2) >= totalPages) {
// //         startPage = totalPages - maxPagesToShow + 1;
// //         endPage = totalPages;
// //       } else {
// //         startPage = currentPage - Math.floor(maxPagesToShow / 2);
// //         endPage = currentPage + Math.floor(maxPagesToShow / 2);
// //       }

// //       for (let i = startPage; i <= endPage; i++) {
// //         pageNumbers.push(i);
// //       }
// //     }

// //     return pageNumbers;
// //   };

// //   const filteredLogs = logs.filter(log => {
// //     if (filters.id && !log.id.toString().includes(filters.id)) return false;
// //     if (filters.expression && !log.expression.includes(filters.expression)) return false;
// //     if (filters.isValid && log.isValid.toString() !== filters.isValid) return false;
// //     if (filters.output && !log.output.toString().includes(filters.output)) return false;
// //     if (filters.createdOn && new Date(log.createdOn).toLocaleDateString() !== filters.createdOn.toLocaleDateString()) return false;
// //     return true;
// //   });

// //   const paginatedLogs = filteredLogs.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

// //   return (
// //     <div id='main'>
// //       <div className="calculator">
// //         <div className="display">
// //           <input className='input' type="text" value={input} placeholder="0" readOnly />
// //           <div id="resultBox" className="result">{result}</div>
// //         </div>
// //         <div className="keypad">
// //           <div>
// //             <button className="operator btnnumber" onClick={() => handleClick('AC')}>AC</button>
// //             <button className="operator btnnumber" onClick={() => handleClick('%')}>%</button>
// //             <button className="operator btnnumber" onClick={() => handleClick('DEL')}>DEL</button>
// //             <button className="operator btnnumber" onClick={() => handleClick('/')}>&divide;</button>
// //           </div>
// //           <div>
// //             <button className="btnnumber" onClick={() => handleClick('7')}>7</button>
// //             <button className="btnnumber" onClick={() => handleClick('8')}>8</button>
// //             <button className="btnnumber" onClick={() => handleClick('9')}>9</button>
// //             <button className="operator btnnumber" onClick={() => handleClick('*')}>&times;</button>
// //           </div>
// //           <div>
// //             <button className="btnnumber" onClick={() => handleClick('4')}>4</button>
// //             <button className="btnnumber" onClick={() => handleClick('5')}>5</button>
// //             <button className="btnnumber" onClick={() => handleClick('6')}>6</button>
// //             <button className="operator btnnumber" onClick={() => handleClick('-')}>&ndash;</button>
// //           </div>
// //           <div>
// //             <button className="btnnumber" onClick={() => handleClick('1')}>1</button>
// //             <button className="btnnumber" onClick={() => handleClick('2')}>2</button>
// //             <button className="btnnumber" onClick={() => handleClick('3')}>3</button>
// //             <button className="operator btnnumber" onClick={() => handleClick('+')}>+</button>
// //           </div>
// //           <div>
// //             <button className="btnnumber zero" onClick={() => handleClick('0')}>0</button>
// //             <button className="btnnumber" onClick={() => handleClick('.')}>.</button>
// //             <button className="btnnumber" onClick={() => handleClick('=')}>=</button>
// //           </div>
// //         </div>
// //       </div>
// //       <div className="logs-container">
// //         <button className="delete-button" onClick={deleteSelectedLogs}>
// //           <DeleteForeverTwoToneIcon /> Delete Selected
// //         </button>
// //         <table>
// //           <thead>
// //             <tr>
// //               <th>
// //                 <input
// //                   type="checkbox"
// //                   checked={selectAll}
// //                   onChange={handleSelectAllChange}
// //                 />
// //               </th>
// //               <th>ID
// //                 <input
// //                   type="text"
// //                   value={filters.id}
// //                   onChange={(e) => handleFilterChange(e, 'id')}
// //                   placeholder="Search ID"
// //                 />
// //                 <SearchIcon />
// //               </th>
// //               <th>Expression
// //                 <input
// //                   type="text"
// //                   value={filters.expression}
// //                   onChange={(e) => handleFilterChange(e, 'expression')}
// //                   placeholder="Search Expression"
// //                 />
// //                 <SearchIcon />
// //               </th>
// //               <th>Is Valid
// //                 <select
// //                   value={filters.isValid}
// //                   onChange={(e) => handleFilterChange(e, 'isValid')}
// //                 >
// //                   <option value="">All</option>
// //                   <option value="true">True</option>
// //                   <option value="false">False</option>
// //                 </select>
// //               </th>
// //               <th>Output
// //                 <input
// //                   type="text"
// //                   value={filters.output}
// //                   onChange={(e) => handleFilterChange(e, 'output')}
// //                   placeholder="Search Output"
// //                 />
// //                 <SearchIcon />
// //               </th>
// //               <th>Created On
// //                 <DatePicker
// //                   selected={filters.createdOn}
// //                   onChange={handleDateChange}
// //                   dateFormat="yyyy/MM/dd"
// //                   placeholderText="Select Date"
// //                 />
// //               </th>
// //             </tr>
// //           </thead>
// //           <tbody>
// //             {paginatedLogs.map((log) => (
// //               <tr key={log.id}>
// //                 <td>
// //                   <input
// //                     type="checkbox"
// //                     checked={selectedIds.includes(log.id)}
// //                     onChange={() => handleCheckboxChange(log.id)}
// //                   />
// //                 </td>
// //                 <td>{log.id}</td>
// //                 <td>{log.expression}</td>
// //                 <td>{log.isValid.toString()}</td>
// //                 <td>{log.output}</td>
// //                 <td>{new Date(log.createdOn).toLocaleDateString()}</td>
// //               </tr>
// //             ))}
// //           </tbody>
// //         </table>
// //       </div>
// //       <div className="pagination">
// //         {getPaginationButtons().map((number) => (
// //           <button
// //             key={number}
// //             onClick={() => handlePageClick(number)}
// //             className={currentPage === number ? 'active' : ''}
// //           >
// //             {number}
// //           </button>
// //         ))}
// //       </div>
// //     </div>
// //   );
// // };

// // export default CalculatorFour;

// // // import React, { useState, useEffect } from 'react';
// // // import axios from 'axios';
// // // import DatePicker from 'react-datepicker';
// // // import 'react-datepicker/dist/react-datepicker.css';
// // // import './Calculator.css';
// // // import DeleteForeverTwoToneIcon from '@mui/icons-material/DeleteForeverTwoTone';
// // // import SearchIcon from '@mui/icons-material/Search';

// // // const CalculatorFour = () => {
// // //   const [input, setInput] = useState('');
// // //   const [result, setResult] = useState('');
// // //   const [logs, setLogs] = useState([]);
// // //   const [filteredLogs, setFilteredLogs] = useState([]);
// // //   const [selectedIds, setSelectedIds] = useState([]);
// // //   const [selectAll, setSelectAll] = useState(false);
// // //   const [filters, setFilters] = useState({
// // //     id: '',
// // //     expression: '',
// // //     isValid: '',
// // //     output: '',
// // //     createdOn: null,
// // //   });

// // //   const [currentPage, setCurrentPage] = useState(1);
// // //   const [totalPages, setTotalPages] = useState(1);
// // //   const rowsPerPage = 10;

// // //   const handleClick = (value) => {
// // //     if (value === 'AC') {
// // //       setInput('');
// // //       setResult('');
// // //     } else if (value === 'DEL') {
// // //       setInput(input.slice(0, -1));
// // //     } else if (value === '=') {
// // //       evaluateExpression();
// // //     } else {
// // //       setInput(input + value);
// // //     }
// // //   };

// // //   const evaluateExpression = async () => {
// // //     try {
// // //       const res = eval(input); // Be cautious with eval, consider safer alternatives
// // //       setResult(res);
// // //       // await axios.post('http://localhost:5000/api/logs', {
// // //         await axios.post('http://localhost:5000/calculations/logs', {
// // //         expression: input,
// // //         isValid: true,
// // //         output: res,
// // //       });
// // //       fetchLogs(); // Fetch logs to update the list
// // //     } catch (error) {
// // //       setResult('Error');
// // //     }
// // //   };

// // //   const fetchLogs = async () => {
// // //     try {
// // //       // const res = await axios.get('http://localhost:5000/api/logs');
// // //       const res = await axios.get('http://localhost:5000/calculations/logs');
// // //       setLogs(res.data.logs);
// // //       applyFilters(res.data.logs); // Apply filters after fetching logs
// // //     } catch (error) {
// // //       console.error('Error fetching logs:', error);
// // //     }
// // //   };

// // //   const applyFilters = (logsToFilter) => {
// // //     let filtered = logsToFilter;
    
// // //     if (filters.id) {
// // //       filtered = filtered.filter(log => log.id.toString().includes(filters.id));
// // //     }
// // //     if (filters.expression) {
// // //       filtered = filtered.filter(log => log.expression.includes(filters.expression));
// // //     }
// // //     if (filters.isValid) {
// // //       filtered = filtered.filter(log => log.isValid.toString() === filters.isValid);
// // //     }
// // //     if (filters.output) {
// // //       filtered = filtered.filter(log => log.output.toString().includes(filters.output));
// // //     }
// // //     if (filters.createdOn) {
// // //       const selectedDate = filters.createdOn.toLocaleDateString();
// // //       filtered = filtered.filter(log => new Date(log.createdOn).toLocaleDateString() === selectedDate);
// // //     }
    
// // //     setFilteredLogs(filtered);
// // //     setTotalPages(Math.ceil(filtered.length / rowsPerPage)); // Update total pages based on filtered logs
// // //     setCurrentPage(1); // Reset to the first page when filters are applied
// // //   };

// // //   const handleFilterChange = (e, key) => {
// // //     const value = e.target.value;
// // //     setFilters(prevFilters => ({ ...prevFilters, [key]: value }));
// // //   };

// // //   const handleDateChange = (date) => {
// // //     setFilters(prevFilters => ({ ...prevFilters, createdOn: date }));
// // //   };

// // //   const handleCheckboxChange = (id) => {
// // //     if (selectedIds.includes(id)) {
// // //       setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
// // //     } else {
// // //       setSelectedIds([...selectedIds, id]);
// // //     }
// // //   };

// // //   const handleSelectAllChange = () => {
// // //     setSelectAll(!selectAll);
// // //     if (!selectAll) {
// // //       setSelectedIds(filteredLogs.map(log => log.id));
// // //     } else {
// // //       setSelectedIds([]);
// // //     }
// // //   };

// // //   const deleteSelectedLogs = async () => {
// // //     try {
// // //       await axios.delete('http://localhost:5000/api/logs', { data: { ids: selectedIds } });
// // //       fetchLogs(); // Fetch logs to update the list
// // //     } catch (error) {
// // //       console.error('Error deleting logs:', error);
// // //     }
// // //   };

// // //   const handlePageClick = (pageNumber) => {
// // //     setCurrentPage(pageNumber);
// // //   };

// // //   const getPaginationButtons = () => {
// // //     const pageNumbers = [];
// // //     const maxPagesToShow = 3;
    
// // //     if (totalPages <= maxPagesToShow) {
// // //       for (let i = 1; i <= totalPages; i++) {
// // //         pageNumbers.push(i);
// // //       }
// // //     } else {
// // //       let startPage, endPage;
      
// // //       if (currentPage <= Math.ceil(maxPagesToShow / 2)) {
// // //         startPage = 1;
// // //         endPage = maxPagesToShow;
// // //       } else if (currentPage + Math.floor(maxPagesToShow / 2) >= totalPages) {
// // //         startPage = totalPages - maxPagesToShow + 1;
// // //         endPage = totalPages;
// // //       } else {
// // //         startPage = currentPage - Math.floor(maxPagesToShow / 2);
// // //         endPage = currentPage + Math.floor(maxPagesToShow / 2);
// // //       }
    
// // //       for (let i = startPage; i <= endPage; i++) {
// // //         pageNumbers.push(i);
// // //       }
// // //     }
    
// // //     return pageNumbers;
// // //   };

// // //   useEffect(() => {
// // //     fetchLogs(); // Fetch logs on initial load
// // //   }, []);

// // //   useEffect(() => {
// // //     applyFilters(logs); // Apply filters whenever the filter state changes
// // //   }, [filters, logs]);

// // //   useEffect(() => {
// // //     setSelectAll(filteredLogs.length > 0 && selectedIds.length === filteredLogs.length);
// // //   }, [selectedIds, filteredLogs]);

// // //   const paginatedLogs = filteredLogs.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

// // //   return (
// // //     <div id='main'>
// // //       <div className="calculator">
// // //         <div className="display">
// // //           <input className='input' type="text" value={input} placeholder="0" readOnly />
// // //           <div id="resultBox" className="result">{result}</div>
// // //         </div>
// // //         <div className="keypad">
// // //           <div>
// // //             <button className="operator btnnumber" onClick={() => handleClick('AC')}>AC</button>
// // //             <button className="operator btnnumber" onClick={() => handleClick('%')}>%</button>
// // //             <button className="operator btnnumber" onClick={() => handleClick('DEL')}>DEL</button>
// // //             <button className="operator btnnumber" onClick={() => handleClick('/')}>/</button>
// // //           </div>
// // //           <div>
// // //             <button className='btnnumber' onClick={() => handleClick('7')}>7</button>
// // //             <button className='btnnumber' onClick={() => handleClick('8')}>8</button>
// // //             <button className='btnnumber' onClick={() => handleClick('9')}>9</button>
// // //             <button className="operator btnnumber" onClick={() => handleClick('*')}>*</button>
// // //           </div>
// // //           <div>
// // //             <button className='btnnumber' onClick={() => handleClick('4')}>4</button>
// // //             <button className='btnnumber' onClick={() => handleClick('5')}>5</button>
// // //             <button className='btnnumber' onClick={() => handleClick('6')}>6</button>
// // //             <button className="operator btnnumber" onClick={() => handleClick('-')}>-</button>
// // //           </div>
// // //           <div>
// // //             <button className='btnnumber' onClick={() => handleClick('1')}>1</button>
// // //             <button className='btnnumber' onClick={() => handleClick('2')}>2</button>
// // //             <button className='btnnumber' onClick={() => handleClick('3')}>3</button>
// // //             <button className="operator btnnumber" onClick={() => handleClick('+')}>+</button>
// // //           </div>
// // //           <div>
// // //             <button className='btnnumber' onClick={() => handleClick('00')}>00</button>
// // //             <button className='btnnumber' onClick={() => handleClick('0')}>0</button>
// // //             <button className="operator btnnumber" onClick={() => handleClick('.')}>.</button>
// // //             <button className="operator btnnumber eql" onClick={() => handleClick('=')}>=</button>
// // //           </div>
// // //         </div>
// // //       </div>
// // //       <div id='table'>
// // //         <div>
// // //           <button
// // //             onClick={deleteSelectedLogs}
// // //             className="delete-button"
// // //             disabled={selectedIds.length === 0} // Disable if no rows are selected
// // //           >
// // //             <DeleteForeverTwoToneIcon style={{ color: 'red'}} />
// // //             Delete Selected
// // //           </button>
// // //         </div>
// // //         <div>
// // //           <table style={{ width: '100%' }}>
// // //             <thead>
// // //               <tr>
// // //                 <th>
// // //                   <input
// // //                     type="checkbox"
// // //                     checked={selectAll}
// // //                     onChange={handleSelectAllChange}
// // //                   />
// // //                 </th>
// // //                 <th>ID
// // //                   <input
// // //                     type="text"
// // //                     value={filters.id}
// // //                     onChange={(e) => handleFilterChange(e, 'id')}
// // //                     placeholder="Search ID"
// // //                   />
// // //                   <SearchIcon />
// // //                 </th>
// // //                 <th>Expression
// // //                   <input
// // //                     type="text"
// // //                     value={filters.expression}
// // //                     onChange={(e) => handleFilterChange(e, 'expression')}
// // //                     placeholder="Search Expression"
// // //                   />
// // //                   <SearchIcon />
// // //                 </th>
// // //                 <th>Valid
// // //                   <input
// // //                     type="text"
// // //                     value={filters.isValid}
// // //                     onChange={(e) => handleFilterChange(e, 'isValid')}
// // //                     placeholder="Valid"
// // //                   />
// // //                   <SearchIcon />
// // //                 </th>
// // //                 <th>Output
// // //                   <input
// // //                     type="text"
// // //                     value={filters.output}
// // //                     onChange={(e) => handleFilterChange(e, 'output')}
// // //                     placeholder="Search Output"
// // //                   />
// // //                   <SearchIcon />
// // //                 </th>
// // //                 <th>Created On
// // //                   <DatePicker
// // //                     selected={filters.createdOn}
// // //                     onChange={handleDateChange}
// // //                     dateFormat="yyyy/MM/dd"
// // //                     placeholderText="Select Date"
// // //                   />
// // //                   <SearchIcon />
// // //                 </th>
// // //               </tr>
// // //             </thead>
// // //             <tbody>
// // //               {paginatedLogs.map(log => (
// // //                 <tr key={log.id}>
// // //                   <td>
// // //                     <input
// // //                       type="checkbox"
// // //                       checked={selectedIds.includes(log.id)}
// // //                       onChange={() => handleCheckboxChange(log.id)}
// // //                     />
// // //                   </td>
// // //                   <td>{log.id}</td>
// // //                   <td>{log.expression}</td>
// // //                   <td>{log.isValid ? 'True' : 'False'}</td>
// // //                   <td>{log.output}</td>
// // //                   <td>{new Date(log.createdOn).toLocaleDateString()}</td>
// // //                 </tr>
// // //               ))}
// // //             </tbody>
// // //           </table>
// // //         </div>
// // //         <div className="pagination">
// // //           <button
// // //             disabled={currentPage === 1}
// // //             onClick={() => handlePageClick(1)}
// // //           >
// // //             First
// // //           </button>
// // //           <button
// // //             disabled={currentPage === 1}
// // //             onClick={() => handlePageClick(currentPage - 1)}
// // //           >
// // //             Previous
// // //           </button>
// // //           {getPaginationButtons().map(page => (
// // //             <button
// // //               key={page}
// // //               onClick={() => handlePageClick(page)}
// // //               className={currentPage === page ? 'active' : ''}
// // //             >
// // //               {page}
// // //             </button>
// // //           ))}
// // //           <button
// // //             disabled={currentPage === totalPages}
// // //             onClick={() => handlePageClick(currentPage + 1)}
// // //           >
// // //             Next
// // //           </button>
// // //           <button
// // //             disabled={currentPage === totalPages}
// // //             onClick={() => handlePageClick(totalPages)}
// // //           >
// // //             Last
// // //           </button>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default CalculatorFour;
