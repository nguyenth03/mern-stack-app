import React, { useCallback, useEffect, useState } from "react";

import { Container, Draggable } from 'react-smooth-dnd';
import PropTypes from "prop-types"; // Import PropTypes
import './Column.scss';
import { Dropdown, Form } from "react-bootstrap";

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
    const handleTitleChange = useCallback((e) => setColumnTitle(e.target.value),[])
    
    useEffect(() => {
        setColumnTitle(column.title)
    }, [column.title])

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
                ))} {/* Use card.id for the key */}
                </Container>
            </div>
            <footer>
                <div className="footer-actions">
                    <i className="fa fa-plus icon" /> Add another card
                </div>
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
