import React, { useState, useEffect, useRef} from 'react'

import { Container, Draggable } from 'react-smooth-dnd'
import { Container as BootstrapContainer, Row, Col, Form, Button} from 'react-bootstrap'
import { isEmpty } from 'lodash'
import './BoardContent.scss'
import { applyDrag } from 'utilities/dragDrop'
import Column from 'components/Column/Column'
import { mapOrder } from 'utilities/sorts'
import { initialData } from 'actions/initialData'

function BoardContent(){
    const [board, setBoard] = useState({})
    const [columns, setColumns] = useState([])
    const [openNewColumnForm, setOpenNewColumnForm] = useState(false)
    const toggleOpenNewColumnForm = () => setOpenNewColumnForm(!openNewColumnForm)

    const newColumnIntRef = useRef(null)

    const [newColumnTitle, setNewColumnTitle] = useState('')
    const onNewColumnTitleChange = (e) => setNewColumnTitle(e.target.value)

    useEffect(() => {
        const boardFromDB = initialData.boards.find(board => board.id === 'board-1')
        if(boardFromDB){
            setBoard(boardFromDB)
        
            setColumns(mapOrder(boardFromDB.columns, boardFromDB.columnOrder,'id'))
        }
    }, [])

    useEffect(() => {
        if(newColumnIntRef && newColumnIntRef.current){
            newColumnIntRef.current.focus()
            newColumnIntRef.current.select()
        }
    }, [openNewColumnForm])

    if (isEmpty(board)){
        return <div className='not-found' style={{'padding' : '10px', 'color': 'white'}}>Board not found</div> 
    }
    const onColumnDrop = (dropResult) => {
        // con/sole.log(dropResult)
        let newColumns = [...columns]
        newColumns = applyDrag(newColumns, dropResult)

        let newBoard = { ...board }
        newBoard.columnOrder = newColumns.map(c => c.id)
        newBoard.columns = newColumns

        setColumns(newColumns)
        setBoard(newBoard)
    }

    const onCardnDrop = (columnId ,dropResult) => {
        if(dropResult.removeIndex !== null || dropResult.addedIndex !== null){
            let newColumns = [...columns]
            
            let currentColumn = newColumns.find(c => c.id === columnId)
            currentColumn.cards = applyDrag(currentColumn.cards, dropResult)
            currentColumn.cardOrder = currentColumn.cards.map(i => i.id)

            setColumns(newColumns)
            // console.log(currentColumn)
        }
    }

    const addNewColumn = () =>{
        if(!newColumnTitle){
            newColumnIntRef.current.focus()
            return
        }
        const newColumnToAdd = {
            id: Math.random().toString(36).substr(2,5),// 5 random characters, will remove when we implement code api
            boardId: board.id,
            title: newColumnTitle.trim(),
            cardOrder: [],
            cards: []
        }

        let newColumns = [...columns]
        newColumns.push(newColumnToAdd)

        let newBoard = { ...board }
        newBoard.columnOrder = newColumns.map(c => c.id)
        newBoard.columns = newColumns

        setColumns(newColumns)
        setBoard(newBoard)
        toggleOpenNewColumnForm()
        // console.log(newColumnTitle)
    };

    const onUpdateColumn = (newColumnToUpdate) => {
        const columnIdToUpdate = newColumnToUpdate.id
        let newColumns = [...columns]
        const columnIndexToUpdate = newColumns.findIndex(i => i.id === columnIdToUpdate)
        if(newColumnToUpdate._destroy){
            /// remove column
            newColumns.splice(columnIndexToUpdate, 1)
        }else{
            /// update column info
            newColumns.splice(columnIndexToUpdate, 1, newColumnToUpdate)
        }
        let newBoard = { ...board }
        newBoard.columnOrder = newColumns.map(c => c.id)
        newBoard.columns = newColumns

        setColumns(newColumns)
        setBoard(newBoard)
        console.log(columnIndexToUpdate)
    }

    return (
        <div className='board-content'>
            <Container
                orientation="horizontal"
                onDrop={onColumnDrop}
                getChildPayload={index => columns[index]}
                dragHandleSelector=".column-drag-handle"
                dropPlaceholder={{
                    animationDuration: 150,
                    showOnTop: true,
                    className: 'column-drop-preview'
                }}
                >
                {columns.map((column, index) =>(
                    <Draggable key={index}>
                        <Column 
                            column={column} 
                            onCardnDrop = {onCardnDrop} 
                            onUpdateColumn={onUpdateColumn}
                        />
                    </Draggable>
                ))}
                </Container>
                <BootstrapContainer className='trello-container'>
                    {!openNewColumnForm &&
                        <Row>
                            <Col className='add-new-column' onClick={toggleOpenNewColumnForm}>
                                <i className="fa fa-plus icon" />Add another column
                            </Col>
                        </Row>
                    }
                    {openNewColumnForm &&
                        <Row>
                        <Col className='enter-new-column'>
                            <Form.Control 
                                size="sm"
                                type="text"
                                placeholder="Enter column title..."
                                className='input-enter-new-column'    
                                ref={newColumnIntRef}
                                value={newColumnTitle}
                                onChange={onNewColumnTitleChange}
                                onKeyDown={event => (event.key === 'Enter') && addNewColumn()}
                            />
                            <Button variant="success" size='sm' onClick={addNewColumn}>Add column</Button>
                            <span className='cancel-icon' onClick={toggleOpenNewColumnForm}>
                                <i className='fa fa-trash icon'/>
                            </span>
                        </Col>
                        </Row>
                    }
                </BootstrapContainer>
        </div>
    )
}

export default BoardContent