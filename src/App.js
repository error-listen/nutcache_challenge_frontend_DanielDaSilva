import React, { useState, useEffect, useRef, useReducer } from 'react';

import MODAL_CREATE_EMPLOYEE from './components/modal_create_employee';
import MODAL_UPDATE_EMPLOYEE from './components/modal_update_employee';
import MODAL_DELETE_EMPLOYEE from './components/modal_delete_employee';
import SNACK_BAR from './components/snack_bar';

import form_reducer from './reducers/form_reducer';

import api from './services/api.js';

import './styles/app.css';
import './styles/modals_create_and_update_employee.css';
import './styles/modal_delete_employee.css';
import './styles/global.css';

const initial_form_state = {
  name: '',
  birth_date: '',
  gender: 'Male',
  email: '',
  cpf: '',
  start_date: '',
  team: ''
};

function App() {

  const [employees, set_employees] = useState([]);
  const [form_state, dispatch] = useReducer(form_reducer, initial_form_state);
  const [error_message, set_error_message] = useState('');
  const [employee_selected_id, set_employee_selected_id] = useState('');
  const [action, set_action] = useState('');

  const modal_delete_ref = useRef(null);
  const modal_create_ref = useRef(null);
  const modal_update_ref = useRef(null);
  const snack_bar_ref = useRef(null);

  useEffect(() => {

    async function get_employees() {
      const response = await api.get('nutemployee');
      set_employees(response.data.employees);
    }

    get_employees();

  }, []);

  async function create_employee() {

    set_action('Created');

    if (!form_state.name ||
      !form_state.birth_date ||
      !form_state.gender ||
      !form_state.email ||
      !form_state.cpf ||
      !form_state.start_date) {
      set_error_message('Fields with * are required');
      return;
    }

    if (!validate_email(form_state.email)) {
      set_error_message('Invalid e-mail');
      return;
    }

    if (form_state.cpf.length < 14) {
      set_error_message('Invalid CPF');
      return;
    }

    if (parseInt(form_state.start_date.slice(0, 2)) > 12 || parseInt(form_state.start_date.slice(0, 2)) < 1 || form_state.start_date.length < 7) {
      set_error_message('Invalid start date');
      return;
    }

    const new_employee = await api.post('nutemployee', {
      name: form_state.name,
      birth_date: form_state.birth_date,
      gender: form_state.gender,
      email: form_state.email,
      cpf: form_state.cpf,
      start_date: form_state.start_date,
      team: form_state.team
    });

    set_employees([...employees, new_employee.data.new_employee]);
    close_modal(modal_create_ref);
    snack_bar_success();
  }

  async function get_employee(employee_id) {
    const response = await api.get(`nutemployee/${employee_id}`);

    dispatch({
      type: 'UPDATE EMPLOYEE',
      payload: response.data.employee[0]
    });
  }

  async function update_employee() {

    set_action('Updated');

    if (!form_state.name ||
      !form_state.birth_date ||
      !form_state.gender ||
      !form_state.email ||
      !form_state.cpf ||
      !form_state.start_date) {
      set_error_message('Fields with * are required');
      return;
    }

    if (!validate_email(form_state.email)) {
      set_error_message('Invalid e-mail');
      return;
    }

    if (form_state.cpf.length < 14) {
      set_error_message('Invalid CPF');
      return;
    }

    if (parseInt(form_state.start_date.slice(0, 2)) > 12 || form_state.start_date.length < 7) {
      set_error_message('Invalid start date');
      return;
    }

    const found_index = employees.findIndex(employee => employee.id === employee_selected_id);
    const new_array = [...employees];

    const updated_employee = await api.put(`nutemployee/${employee_selected_id}`, {
      name: form_state.name,
      birth_date: form_state.birth_date,
      gender: form_state.gender,
      email: form_state.email,
      cpf: form_state.cpf,
      start_date: form_state.start_date,
      team: form_state.team
    });

    new_array[found_index] = updated_employee.data.updated_employee;

    set_employees(new_array);
    close_modal(modal_update_ref);
    snack_bar_success();
  }

  async function delete_employee() {
    set_action('Deleted');
    await api.delete(`nutemployee/${employee_selected_id}`);
    set_employees(
      employees.filter(employee => {
        return employee.id !== employee_selected_id;
      })
    );
    close_modal(modal_delete_ref);
    snack_bar_success();
  }

  function open_modal(modal) {
    modal.current.style.display = 'block';
  }

  function close_modal(modal) {
    modal.current.style.display = 'none';
    dispatch({
      type: 'RESET REDUCER',
      payload: initial_form_state
    });
    set_employee_selected_id('');
    set_error_message('');
  }

  function cpf_input_mask(cpf) {
    cpf = cpf.replace(/\D/g, "");
    cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
    cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
    cpf = cpf.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    return cpf;
  }

  function start_date_input_mask(date) {
    date = date.replace(/\D/g, "");
    date = date.replace(/(\d{2})(\d)/, "$1/$2");
    date = date.replace(/(\d{4})(\d)/);
    return date;
  }

  function convert_start_date(date) {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec'
    ];

    const month = date.slice(0, 2);
    const month_int = parseInt(month);
    return months[month_int - 1];
  }

  function validate_email(email) {
    const valide_email = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return valide_email.test(String(email).toLowerCase());
  }

  function input_change(e) {
    dispatch({
      type: 'INPUT TEXT',
      field: e.target.name,
      payload: e.target.value
    });
  }

  function snack_bar_success() {
    snack_bar_ref.current.className = 'show';
    setTimeout(function () { snack_bar_ref.current.className = snack_bar_ref.current.className.replace('show', ''); }, 3000);
  }

  return (
    <div className="app">
      <MODAL_CREATE_EMPLOYEE
        modal_ref={modal_create_ref}
        name_input={form_state.name}
        birth_date_input={form_state.birth_date}
        gender_select={form_state.gender}
        email_input={form_state.email}
        cpf_input={cpf_input_mask(form_state.cpf)}
        start_date_input={start_date_input_mask(form_state.start_date)}
        team_select={form_state.team}
        handle_error_message={error_message}
        handle_input_change={(e) => input_change(e)}
        handle_close_modal={() => close_modal(modal_create_ref)}
        handle_create_employee={create_employee} />
      <MODAL_UPDATE_EMPLOYEE
        modal_ref={modal_update_ref}
        name_input={form_state.name}
        birth_date_input={form_state.birth_date}
        gender_select={form_state.gender}
        email_input={form_state.email}
        cpf_input={cpf_input_mask(form_state.cpf)}
        start_date_input={start_date_input_mask(form_state.start_date)}
        team_select={form_state.team}
        handle_error_message={error_message}
        handle_input_change={(e) => input_change(e)}
        handle_close_modal={() => close_modal(modal_update_ref)}
        handle_update_employee={update_employee} />
      <MODAL_DELETE_EMPLOYEE
        modal_ref={modal_delete_ref}
        employee_name={form_state.name}
        handle_close_modal={() => close_modal(modal_delete_ref)}
        handle_delete_employee={delete_employee} />
      <div className="employees">
        <div className="employees_header">
          <h3>Employees</h3>
          <button className="ripple" onClick={() => open_modal(modal_create_ref)}>+ Add Employee</button>
        </div>
        <table className="employees_table">
          <thead>
            <tr>
              <th>NAME</th>
              <th>TEAM</th>
              <th>START DATE</th>
              <th>OPTIONS</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(employee => {
              return (
                <tr key={employee.id}>
                  <td data-label="EMPLOYEE">
                    <div className="name_and_email">
                      <p>{employee.name}</p>
                      <p>{employee.email}</p>
                    </div>
                  </td>
                  <td data-label="TEAM" className="team_td">{!employee.team ? 'None' : <p className="team">{employee.team}</p>}</td>
                  <td data-label="START DATE">{convert_start_date(employee.start_date)} of {employee.start_date.slice(-4)}</td>
                  <td data-label="OPTIONS">
                    <div className="dropdown">
                      <button>&#8942;</button>
                      <div className="dropdown_content">
                        <span onClick={() => { open_modal(modal_update_ref); set_employee_selected_id(employee.id); get_employee(employee.id); }} href="#">Update</span>
                        <span onClick={() => { open_modal(modal_delete_ref); set_employee_selected_id(employee.id); get_employee(employee.id); }} href="#">Delete</span>
                      </div>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <SNACK_BAR snack_ref={snack_bar_ref} background={'#228B22'} action={action} />
    </div>
  );
}

export default App;
