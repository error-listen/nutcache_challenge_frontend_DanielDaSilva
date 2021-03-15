import React from 'react';

function SNACK_BAR(props){
    return(
        <div ref={props.snack_ref} id='snackbar' style={{backgroundColor: props.background}}>{props.action} employee.</div>
    )
}

export default SNACK_BAR;