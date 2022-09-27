import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

interface ConnectedClients {
    [id: string]: Socket
}

@Injectable()
export class MessagesWsService {

    private connectedClients: ConnectedClients = {}

    registerClient(cliente: Socket) {
        this.connectedClients[cliente.id] = cliente;
    }

    removeClient(clientId: string) {
        delete this.connectedClients[clientId];
    }

    getConnectedClients(): number {
        return Object.keys(this.connectedClients).length;
    }


}
