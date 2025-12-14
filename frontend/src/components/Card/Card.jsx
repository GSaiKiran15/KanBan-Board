import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState, useRef, useEffect } from "react";
import "./Card.css";
import { useBoardContext } from "../../contexts/BoardContext";
import axios from "axios";
import useUser from "../../useUser.js";

export const Card = ({ card, columnId }) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [editedTitle, setEditedTitle] = useState(card.title);
  const { boards, setBoards } = useBoardContext();
  const allBoards = boards.map((board) => [board.title, board.id]);
  const { user, isLoading } = useUser();

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

  const handleDone = async (e) => {
    e.stopPropagation();
    if (!editedTitle.trim()) return;
    setBoards((prevBoards) =>
      prevBoards.map((board) => ({
        ...board,
        items: board.items.map((item) =>
          item.id === card.id ? { ...item, title: editedTitle } : item
        ),
      }))
    );
    try {
      if (isLoading || !user) {
        return;
      }
      const token = await user.getIdToken();
      await axios.patch(
        `/api/editCard/${card.id}`,
        { editedTitle, boardId: columnId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {return error}
    setIsEditing(false);
  };

  const handleCancel = (e) => {
    e.stopPropagation();
    setEditedTitle(card.title);
    setIsEditing(false);
  };

  return isEditing ? (
    <div className="add-item-form">
      <input
        autoFocus
        value={editedTitle}
        onChange={(e) => setEditedTitle(e.target.value)}
        placeholder="Rename this card..."
        required
      />

      <div className="form-actions">
        <button className="add-btn-primary" onClick={handleDone}>
          Done
        </button>
        <button className="add-btn-secondary" onClick={handleCancel}>
          Cancel
        </button>
      </div>
    </div>
  ) : (
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
              {!isMoving ? (
                <>
                  <button
                    className="menu-item"
                    onPointerDown={(e) => {
                      e.stopPropagation();
                      setShowMenu(false);
                      setIsEditing(true);
                    }}
                  >
                    <span className="menu-icon">✏️</span>
                    Edit
                  </button>
                  <button
                    className="menu-item"
                    onPointerDown={(e) => {
                      e.stopPropagation();
                      setIsMoving(true);
                    }}
                  >
                    <span className="menu-icon">🔄</span>
                    Move
                  </button>
                  <button
                    className="menu-item"
                    onPointerDown={async (e) => {
                      e.stopPropagation();
                      setShowMenu(false);
                      setBoards((prevBoards) =>
                        prevBoards.map((board) => ({
                          ...board,
                          items: board.items.filter(
                            (item) => item.id !== card.id
                          ),
                        }))
                      );
                      try {
                        if (isLoading || !user) {
                          return;
                        }
                        const token = await user.getIdToken();
                        await axios.delete(`/api/deleteCard/${card.id}`, {
                          data: {
                            boardId: columnId,
                          },
                          headers: { Authorization: `Bearer ${token}` },
                        });
                      } catch (error) {return error}
                    }}
                  >
                    <span className="menu-icon">🗑️</span>
                    Delete
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="menu-item"
                    onPointerDown={(e) => {
                      e.stopPropagation();
                      setIsMoving(false);
                    }}
                  >
                    <span className="menu-icon">←</span>
                    Back
                  </button>
                  {allBoards
                    .filter((board) => board[1] !== columnId)
                    .map((board) => (
                      <button
                        key={board[1]}
                        className="menu-item"
                        onPointerDown={async (e) => {
                          e.stopPropagation();
                          if (!board[1]) {
                            return;
                          }
                          setBoards((prevBoards) =>
                            prevBoards.map((b) => {
                              if (b.id === board[1]) {
                                return {
                                  ...b,
                                  items: [
                                    ...b.items,
                                    { ...card, board_id: board[1] },
                                  ],
                                };
                              }
                              return {
                                ...b,
                                items: b.items.filter(
                                  (item) => item.id !== card.id
                                ),
                              };
                            })
                          );
                          try {
                            if (isLoading || !user) {
                              return;
                            }
                            const token = await user.getIdToken();
                            await axios.patch(
                              `/api/moveCard/${card.id}`,
                              {
                                destinationBoardId: board[1],
                                boardId: columnId,
                              },
                              { headers: { Authorization: `Bearer ${token}` } }
                            );
                          } catch (error) {return error}
                          setShowMenu(false);
                          setIsMoving(false);
                        }}
                      >
                        <span className="menu-icon">📋</span>
                        {board[0]}
                      </button>
                    ))}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
