import Account from './model';

export class AccountService {
  account;

  constructor(account) {
    this.account = account;
  }

  static async registerAccount(data) {
    let accountData = { ...data };
    let account = await Account.create(accountData);
    return account;
  }
}
