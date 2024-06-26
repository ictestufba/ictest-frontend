import { api } from "@/lib/api";
import { TestCase } from "@/types/models";
import { renderStatusLabel } from "@/utils/renderStatusLabel";
import { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable, OnDragEndResponder } from "react-beautiful-dnd";
import { useMembers } from "../../home/projects/[id]/hooks/useMembers";
import { CaseCard } from "../card/case";
import styles from "./styles.module.css";

type BoardProps = {
  initialCases: {
    [key: string]: TestCase[];
  };
  onCardClick: (testCase: TestCase)=>void;
  projectId: string;
  setIsPageLoading: (value:boolean)=>void;
}

export function Board({ initialCases, onCardClick , projectId, setIsPageLoading}: BoardProps) {
  const {data:users, currentUserId, isLoading} = useMembers(projectId)
  const isMember = !isLoading && (users?.find(user=>user.id === currentUserId) !== undefined);

  const [cases, setCases] = useState(initialCases);
  const onDragEnd: OnDragEndResponder = async (result) => {
    if (!isMember) return;
    if (!result.destination) return;
    const [ itemMoved ] = cases[result.source.droppableId].splice(result.source.index, 1);

    if (itemMoved.status !== result.destination.droppableId) {
      setIsPageLoading(true);
      itemMoved.status = result.destination.droppableId as TestCase["status"];
      await api.patch(`/test-cases/${itemMoved.id}/update`, {
        data: {
          ...itemMoved,
        },
      });
    }
    cases[result.destination.droppableId].splice(result.destination.index, 0, itemMoved);

    setCases(cases);
    setIsPageLoading(false);
  };

  useEffect(()=>{
    setCases(initialCases);
  }, [initialCases])

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
                    {cases[status]?.map((testCase, index) =>{
                      return (
                        <Draggable key={testCase.id} draggableId={testCase.id.toString()} index={index}>
                          {(provided) => (
                            <div
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              ref={provided.innerRef}
                              className={styles.cardContainer}
                            >
                              <CaseCard key={testCase.id} onClick={()=>{onCardClick(testCase)}} testCase={testCase}/>
                            </div>
                          )}
                        </Draggable>
                      )
                    })}
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