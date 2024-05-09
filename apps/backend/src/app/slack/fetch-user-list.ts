import fetch from 'node-fetch';
import {SlackUserIndex} from "./slack-user-index";
import {SlackUser} from "./slack-user";

export async function userList(bottoken: unknown): Promise<SlackUserIndex | void> {
  return await fetch(
    `https://slack.com/api/users.list`,
    {
      headers: {
        Authorization: `Bearer ${bottoken}`,
        'Content-type': 'application/json'
      },
    })
    .then(res => res.json())
    .then((res: { members: SlackUser[] }) => {
      if (res.members) {
        return res.members;
      } else {
        console.log(`Can't fetch slack user list (missing members info) [%o]`, res);
        throw new Error(`Can't fetch slack user list`);
      }
    })
    .then(
      (users: SlackUser[]) => users.reduce((index, user) => ({
          ...index,
          [user.name]: user
        }),
        {} as SlackUserIndex
      )
    );
}
