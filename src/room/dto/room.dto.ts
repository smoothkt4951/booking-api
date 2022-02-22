export class CreateRoomDto {
  codeName: string;

  size: string;

  price: number;

  image: string;
}
export class UpdateRoomDto {
  codeName: string;

  size: string;

  price: number;

  image: string;
}

export class RoomResponseRoomDto {
  codeName: string;

  size: string;

  isVacant: boolean;

  price: number;

  image: string;
}
