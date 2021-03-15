import React from 'react';

function MODAL_CREATE_EMPLOYEE(props) {
    return (
        <div className="modal_create_and_update_employee" ref={props.modal_ref}>
            <div className="modal_content">
                <h3>Create Employee</h3>
                <form>
                    <label>Name*</label>
                    <input type="text" name="name" value={props.name_input} onChange={props.handle_input_change} />
                    <div className="row">
                        <div className="column">
                            <label>Birth date*</label>
                            <input type="date" name="birth_date" value={props.birth_date_input} onChange={props.handle_input_change} />
                        </div>
                        <div className="column">
                            <label>Gender*</label>
                            <select name="gender" value={props.gender_select} onChange={props.handle_input_change}>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>
                    <label>E-mail*</label>
                    <input type="text" name="email" value={props.email_input} onChange={props.handle_input_change} />
                    <label>CPF*</label>
                    <input type="text" name="cpf" onChange={props.handle_input_change} value={props.cpf_input} maxLength="14" />
                    <div className="row">
                        <div className="column">
                            <label>Start date*</label>
                            <input type="text" name="start_date" onChange={props.handle_input_change} value={props.start_date_input} maxLength="7" />
                        </div>
                        <div className="column">
                            <label>Team</label>
                            <select name="team" value={props.team_select} onChange={props.handle_input_change}>
                                <option value="None">Select</option>
                                <option value="Frontend">Frontend</option>
                                <option value="Backend">Backend</option>
                                <option value="Mobile">Mobile</option>
                            </select>
                        </div>
                    </div>
                </form>
                <p className="error">{props.handle_error_message}</p>
                <div className="buttons">
                    <button className="cancel_modal_button" onClick={props.handle_close_modal}>Cancel</button>
                    <button className="create_employee_button ripple" onClick={props.handle_create_employee}>Create</button>
                </div>
            </div>
        </div>
    )
}

export default MODAL_CREATE_EMPLOYEE;