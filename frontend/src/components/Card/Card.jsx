// Card.jsx
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState, useRef, useEffect } from "react";
import "./Card.css";

export const Card = ({ card, columnId, onDeleteCard, onEditCard}) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(card.title);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: `task-${card.id}`, 
    data: { type: "task", taskId: card.id, columnId }, 
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
    opacity: isDragging ? 0.7 : 1,
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMenu = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

   const handleDone = (e) => {
    e.stopPropagation();
    if (!editedTitle.trim()) return; 
    onEditCard?.(card.id, editedTitle);
    setIsEditing(false);
  };

  const handleCancel = (e) => {
    e.stopPropagation();
    setEditedTitle(card.title); 
    setIsEditing(false);
  };

  return (
    isEditing ? (
      <div className="add-item-form">
            <input
            autoFocus
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              placeholder="Rename this card..."
              required
            />

            <div className="form-actions">
              <button 
              className="add-btn-primary"
              onClick={handleDone}>
                Done
              </button>
              <button
                className="add-btn-secondary"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </div>
    ) :(
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className="task-card"
    >
      <div className="card-header">
        <p>{card.title}</p>
        <div className="card-actions">
          <button
            ref={buttonRef}
            className="menu-btn"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={toggleMenu}
          >
            ...
          </button>
          {showMenu && (
            <div ref={menuRef} className="context-menu">
              <button className="menu-item" onPointerDown={(e) => {
                e.stopPropagation()
                setShowMenu(false)
                setIsEditing(true)
                }}>
                <span className="menu-icon">✏️</span>
                Edit
              </button>
              <button
                className="menu-item"
                onPointerDown={(e) => {
                  e.stopPropagation();
                  onDeleteCard?.(card.id);
                }}
              >
                <span className="menu-icon">🗑️</span>
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
    )
  );
};