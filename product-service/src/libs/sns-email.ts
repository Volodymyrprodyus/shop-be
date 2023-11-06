import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import { SNS_TOPIC, REGION } from '../constants';

export const sendEmailAction = async ({
  message,
  subject,
  status,
}: {
  message: string;
  subject: string;
  status: 'error' | 'success';
}) => {
  const snsClient = new SNSClient({ region: REGION });
  const publishCommand = new PublishCommand({
    TopicArn: SNS_TOPIC,
    Subject: subject,
    Message: message,
    MessageAttributes: {
      status: {
        DataType: 'String',
        StringValue: status,
      },
    },
  });

  try {
    await snsClient.send(publishCommand);
  } catch (error) {
    console.log('Email send error: ', error);
  }
};
