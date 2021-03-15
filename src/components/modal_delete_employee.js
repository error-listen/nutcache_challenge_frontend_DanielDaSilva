import React from 'react';

function MODAL_CREAT_EMPLOYEE(props) {
    return (
        <div className="modal_delete_employee" ref={props.modal_ref}>
            <div className="modal_content">
                <h3>Delete Employee</h3>
                <p>{props.employee_name}</p>
                <div className="buttons_delete_modal">
                    <button className="cancel__modal_button" onClick={props.handle_close_modal}>Cancel</button>
                    <button className="delete_modal_button ripple" onClick={props.handle_delete_employee}>Delete</button>
                </div>
            </div>
        </div>
    )
}

export default MODAL_CREAT_EMPLOYEE;