import { TestCase } from "@/types/models";
import { renderStatusLabel } from "@/utils/renderStatusLabel";
import { useState } from "react";
import { DragDropContext, Draggable, Droppable, OnDragEndResponder } from "react-beautiful-dnd";
import { CaseCard } from "../card/case";
import styles from "./styles.module.css";

type BoardProps = {
  initialCases: {
    [key: string]: TestCase[];
  };
}

export function Board({ initialCases }: BoardProps) {
  const [cases, setCases] = useState(initialCases);
  const onDragEnd: OnDragEndResponder = (result) => {
    if (!result.destination) return;
    const [ itemMoved ] = cases[result.source.droppableId].splice(result.source.index, 1);
    cases[result.destination.droppableId].splice(result.destination.index, 0, itemMoved);

    setCases(cases);

  };

  return (
    <div className={styles.container}>
      <DragDropContext onDragEnd={onDragEnd}>
        {
          Object.keys(cases).map((status, index) => (
            <div key={index} className={styles.innerContainer}>
              <div className={styles.innerTitleContainer}>
                <h1 className={styles.innerTitle}>{renderStatusLabel(status)}</h1>
              </div>
              <Droppable droppableId={status}>
              {(provided, snapshot) => {
                return (
                  <div className={snapshot.isDraggingOver ? styles.draggableContainerFlow : styles.draggableContainerBase} ref={provided.innerRef} {...provided.droppableProps}>
                    {cases[status]?.map((testCase, index) => (
                      <Draggable
                        key={testCase.id}
                        draggableId={testCase.id.toString()}
                        index={index}
                      >
                        {(provided) =>  (
                            <div
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              ref={provided.innerRef}
                              className={styles.cardContainer}
                            >
                              <CaseCard key={testCase.id} onClick={()=>{console.log('Teste')}} testCase={testCase}/>
                            </div>
                          )
                        }
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )
              }}
              </Droppable>
            </div>
            
          ))
        }
      </DragDropContext>
    </div>
  );
};