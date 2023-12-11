export type UserData = {
  _id: string;
  name: string;
  job: string;
  email: string;
  position: string;
  phoneNumber: string;
  hireDate: string;
  birthDate: string;
  admin: boolean;
};
export type ResponeType = {
  status: boolean;
  data: UserData[];
  admin: boolean;
}