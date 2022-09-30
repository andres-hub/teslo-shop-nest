import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { NewMessageDto } from './dto/new-message.dto';
import { MessagesWsService } from './messages-ws.service';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/auth/interfaces';

@WebSocketGateway({ cors: true })
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() wss: Server;

  constructor(
    private readonly messagesWsService: MessagesWsService,
    private readonly jwtService: JwtService
  ) { }

  async handleConnection(client: Socket,) {
    const token = client.handshake.headers.authentication as string;
    let payload: JwtPayload;

    try {

      payload = this.jwtService.verify(token);
      this.messagesWsService.registerClient(client, payload.id);

    } catch (error) {
      client.disconnect();
      return;
    }

    console.log(payload);

    // console.log('Cliente connectado', token);
    // console.log({conectados: this.messagesWsService.getConnectedClients()});
    this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients());
  }

  handleDisconnect(client: Socket) {
    // console.log('Cliente desconectado', client.id);
    this.messagesWsService.removeClient(client.id);
    this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients());

    // console.log({conectados: this.messagesWsService.getConnectedClients()});

  }

  @SubscribeMessage('message-from-client')
  handleMessageFromClient(client: Socket, payload: NewMessageDto) {
    // message-from-server
    //  emite unicamente al cliente
    // client.emit('message-from-server',{
    //   fullName: 'Soy yo',
    //   message: payload.message || 'no-message!!'
    // });

    //  emite a todos menos al cliente inicial cliente
    // client.broadcast.emit('message-from-server', {
    //   fullName: 'Soy yo',
    //   message: payload.message || 'no-message!!'
    // });

    //  emite a todos 
    this.wss.emit('message-from-server', {
      fullName: this.messagesWsService.getUserFullName(client.id),
      message: payload.message || 'no-message!!'
    });


  }

}
