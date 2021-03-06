import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserEvent } from './events/create-user.event';

@Injectable()
export class UserService {
  private readonly users: any[] = [];

  constructor(
    @Inject('COMMUNICATION') private readonly communicationClient: ClientProxy,
    @Inject('ANALYTICS') private readonly analyticsClient: ClientProxy,
  ) {}

  create(createUserDto: CreateUserDto) {
    this.users.push(createUserDto);
    console.log('an user_created event emitted from api-gateway');
    this.communicationClient.emit(
      'user_created',
      new CreateUserEvent(createUserDto.email),
    );
    console.log('an user_created event emitted from api-gateway to analytics');
    this.analyticsClient.emit(
      'user_created',
      new CreateUserEvent(createUserDto.email),
    );
  }

  getAnalytics() {
    return this.analyticsClient.send(
      {
        cmd: 'get_analytics',
      },
      {},
    );
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
