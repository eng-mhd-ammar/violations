import { State, StateAttributes } from "./state.model";

export abstract class StateRepository {
    abstract create(state: State): Promise<State>;

    abstract findAll(): Promise<State[]>;

    abstract findById(
        id: number,
    ): Promise<State | null>;

    abstract findByIdIncludingDeleted(
        id: number,
    ): Promise<State | null>;

    abstract findByName(
        name: string,
    ): Promise<State | null>;

    abstract update(
        id: number,
        data: Partial<StateAttributes>,
    ): Promise<State>;

    abstract delete(id: number): Promise<State>;

    abstract restore(id: number): Promise<State>;

    abstract forceDelete(id: number): Promise<State>;
}