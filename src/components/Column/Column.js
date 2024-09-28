import React from "react";

import { Container, Draggable } from 'react-smooth-dnd';
import PropTypes from "prop-types"; // Import PropTypes
import './Column.scss';
import Card from "components/Card/Card";
import { mapOrder } from "utilities/sorts";

function Column(props) {
    const { column, onCardnDrop } = props;
    const cards = mapOrder(column.cards, column.cardOrder, 'id');

    return (
        <div className='column-drag-handle'>
            <header>{column.title}</header>
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
