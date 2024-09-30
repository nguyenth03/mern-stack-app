import React, { useEffect, useState, useRef} from "react";

import { Container, Draggable } from 'react-smooth-dnd';
import PropTypes from "prop-types"; // Import PropTypes
import './Column.scss';
import { Dropdown, Form, Button } from "react-bootstrap";
import { cloneDeep } from "lodash";

import Card from "components/Card/Card";
import { mapOrder } from "utilities/sorts";
import ConfirmModal from "components/Common/ComfirmModal";
import { MODAL_ACTION_CONFIRM } from "utilities/constants";
import { selectAllInlineText, saveContenAfterPressEnter } from "utilities/contentEditTable";

function Column(props) {
    const { column, onCardnDrop, onUpdateColumn } = props;
    const cards = mapOrder(column.cards, column.cardOrder, 'id');

    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const toggleShowConfirmModal = () => setShowConfirmModal(!showConfirmModal)
    const [columnTitle, setColumnTitle] = useState('')
    const handleTitleChange = (e) => setColumnTitle(e.target.value)
    
    const [openNewCardForm, setOpenNewCardForm] = useState(false)
    const toggleOpenNewCardForm = () => setOpenNewCardForm(!openNewCardForm)

    const newCardTextareaRef = useRef(null)

    const [newCardTitle, setNewCardTitle] = useState('')
    const onNewCardTitleChange = (e) => setNewCardTitle(e.target.value)

    useEffect(() => {
        setColumnTitle(column.title)
    }, [column.title])

    useEffect(() => {
        if(newCardTextareaRef && newCardTextareaRef.current){
            newCardTextareaRef.current.focus()
            newCardTextareaRef.current.select()
        }
    }, [openNewCardForm])

    const onConfirmModalAction = (type) =>{
        // console.log(type)
        if (type === MODAL_ACTION_CONFIRM){
            const newColumn = {
                ...column,
                _destroy: true
            }
            onUpdateColumn(newColumn)
        }
        toggleShowConfirmModal()
    }

    const handleTitleBlur = () => {
        console.log(columnTitle)
        const newColumn = {
            ...column,
            title: columnTitle
        }
        onUpdateColumn(newColumn)
    }

    const addNewCard = () => {
        if(!newCardTitle){
            newCardTextareaRef.current.focus()
            return
        }

        const newCardToAdd = {
            id: Math.random().toString(36).substr(2,5),// 5 random characters, will remove when we implement code api
            boardId: column.boardId,
            columnId: column.id,
            title: newCardTitle.trim(),
            cover: null
        }

        let newColumn = cloneDeep(column)
        newColumn.cards.push(newCardToAdd)
        newColumn.cardOrder.push(newCardToAdd.id)

        onUpdateColumn(newColumn)
        setNewCardTitle('')
        toggleOpenNewCardForm()
    }

    return (
        <div className='column-drag-handle'>
            <header>
                <div className="column-title">
                    <Form.Control 
                        size="sm"
                        type="text"
                        className='mern-content-editable'    
                        value={columnTitle}
                        onChange={handleTitleChange}
                        onBlur={handleTitleBlur}
                        onKeyDown={saveContenAfterPressEnter}
                        spellCheck="false"
                        onClick={selectAllInlineText}
                        onMouseDown={e => e.preventDefault()}
                        // onKeyDown={event => (event.key === 'Enter') && addNewColumn()}
                    />
                </div>
                <div className="column-dropdown-actions">
                    <Dropdown>
                        <Dropdown.Toggle id="dropdown-basic" size="sm" className="dropdown-btn"/>
                        <Dropdown.Menu>
                            <Dropdown.Item>Add card...</Dropdown.Item>
                            <Dropdown.Item onClick={toggleShowConfirmModal}>Remove column...</Dropdown.Item>
                            <Dropdown.Item>Move all cards</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </header>
            <div className="card-list">

            <Container
                    // onDragStart={e => console.log("drag started", e)}
                    // onDragEnd={e => console.log("drag end", e)}
                    // onDragEnter={() => {
                    //   console.log("drag enter:", column.id);
                    // }}
                    // onDragLeave={() => {
                    //   console.log("drag leave:", column.id);
                    // }}
                    groupName="col"
                    onDrop={ dropResult => onCardnDrop(column.id, dropResult)}
                    getChildPayload={index => cards[index]}
                    dragClass="card-ghost"
                    dropClass="card-ghost-drop"
                    onDropReady={p => console.log('Drop ready: ', p)}
                    dropPlaceholder={{                      
                      animationDuration: 150,
                      showOnTop: true,
                      className: 'card-drop-preview' 
                    }}
                    dropPlaceholderAnimationDuration={200}
                  >
                {cards.map((card, index) => (
                    <Draggable key={index}>
                         <Card card={card} />
                    </Draggable>
                ))}
                </Container>
                {openNewCardForm && 
                    <div className="add-new-card-area">
                    <Form.Control 
                        size="sm"
                        as="textarea"
                        rows="3"
                        placeholder="Enter a title for this card..."
                        className='textarea-enter-new-card'    
                        ref={newCardTextareaRef}
                        value={newCardTitle}
                        onChange={onNewCardTitleChange}
                        onKeyDown={event => (event.key === 'Enter') && addNewCard()}
                    />
                 </div>
                }
            </div>
            <footer>
                {openNewCardForm && 
                    <div className="add-new-card-actions">
                     <Button variant="success" size='sm' onClick={addNewCard} >Add card</Button>
                     <span className='cancel-icon' onClick={toggleOpenNewCardForm}>
                         <i className='fa fa-trash icon'/>
                     </span>
                 </div>
                }
                {!openNewCardForm && 
                    <div className="footer-actions" onClick={toggleOpenNewCardForm}>
                        <i className="fa fa-plus icon" /> Add another card
                    </div>
                }
            </footer>
            <ConfirmModal
                show={showConfirmModal }
                onAction={onConfirmModalAction}
                title="Remove column"
                content={`Are you sure you want to remove <strong>${column.title}</strong>! All related cards will also be remove`}
            />
        </div>
    );
}

// Define prop types for Column component
Column.propTypes = {
    column: PropTypes.shape({
        id: PropTypes.string.isRequired,
        boardId: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        cardOrder: PropTypes.arrayOf(PropTypes.string).isRequired,
        cards: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.string.isRequired,
                boardId: PropTypes.string.isRequired,
                columnId: PropTypes.string.isRequired,
                title: PropTypes.string.isRequired,
                cover: PropTypes.string // or PropTypes.any if cover can be of different types
            })
        ).isRequired,
    }).isRequired,
};

export default Column;
