import {userProfile} from '../slack/fetch-user-profile';
import {sendSlackMessage} from '../slack/send-slack-message';

export const notificationAfterLeaderChangeFactory = (
  functions: import('firebase-functions').FunctionBuilder,
  config: Record<string, any>
) => functions.firestore.document('team/{team}/user/{user}').onUpdate(
  async (change, context) => {
    if (change.after.data().chapterLeader !== change.before.data().chapterLeader) {
      const slackUser = await userProfile(context.params.user, config.slack.bottoken);
      await sendSlackMessage(config.slack.bottoken, {
        channel: `@${slackUser.name}`,
        text: `Your chapter leader was changed to ${change.after.data().chapterLeader}.`
      });
    }
  }
)
