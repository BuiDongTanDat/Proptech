import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IUserAccount } from '../models/model';

@Injectable({
    providedIn: 'root',
})
export class UserStore {
    private usersSubject = new BehaviorSubject<IUserAccount[]>([]);
    users$: Observable<IUserAccount[]> = this.usersSubject.asObservable();

    setUsers(users: IUserAccount[]) {
        this.usersSubject.next(users);
    }

    addUser(user: IUserAccount) {
        const current = this.usersSubject.value;
        this.usersSubject.next([...current, user]);
    }

    updateUser(updated: IUserAccount) {
        const current = this.usersSubject.value.map(user =>
            user._id === updated._id ? updated : user
        );
        this.usersSubject.next(current);
    }

    removeUser(id: string) {
        const current = this.usersSubject.value.filter(user => user._id !== id);
        this.usersSubject.next(current);
    }

    clear() {
        this.usersSubject.next([]);
    }

    // Lấy giá trị hiện tại của users (dùng trong trường hợp cần truy cập trực tiếp, không qua Observable)
    getSnapshot(): IUserAccount[] {
        return this.usersSubject.value;
    }
}
