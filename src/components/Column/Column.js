import React from "react";
import './Column.scss';
import Task from "components/Task/Task";

function Column(){
    return (
        <div className='column'>
         <header>Brainstorm</header>
         <ul className="task-list">
         <Task/>          
         <Task/>          
         <Task/>          
         
        <li className="task-item">Never give up</li>
        <li className="task-item">Never give up</li>
        <li className="task-item">Hope</li>
        </ul>
          <footer>Add another card</footer>
         </div>
    )
}

export default Column