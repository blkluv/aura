import React from 'react';
import { useMessages, useStreamMessages } from '@xmtp/react-sdk';

import { ChatBox, ChatPill, ChatHeader } from '@/components';

import type { Conversation, DecodedMessage } from '@xmtp/react-sdk';

interface Props {
	conversation: Conversation;
}

const ChatArea = ({ conversation }: Props) => {
	const { messages, isLoading, error } = useMessages(conversation);
	const chatContainer = React.useRef<HTMLDivElement>(null);

	const [streamedMessages, setStreamedMessages] = React.useState<
		DecodedMessage[]
	>([]);

	React.useEffect(() => {
		if (messages.length > 0) {
			setStreamedMessages(messages);
		}
	}, [messages]);

	const onMessage = React.useCallback(
		(message: DecodedMessage) => {
			setStreamedMessages((prev) => [...prev, message]);
		},
		[streamedMessages]
	);

	useStreamMessages(conversation, onMessage);

	const Scroll = () => {
		const { offsetHeight, scrollHeight, scrollTop } =
			chatContainer.current as HTMLDivElement;
		chatContainer.current?.scrollTo(0, scrollHeight);
	};

	React.useEffect(() => {
		Scroll();
	}, [streamedMessages]);

	return (
		<div className='w-full flex flex-col justify-between items-start h-[92dvh] sm:h-[100vh] '>
			<div className=''>
				<ChatHeader conversation={conversation} />
			</div>
			<div className='flex flex-col justify-end w-full h-full overflow-y-scroll scrollbar-hide'>
				<div
					className='flex flex-col w-full gap-1 p-4 px-2 overflow-y-scroll sm:px-8 scrollbar-hide'
					ref={chatContainer}
				>
					{!isLoading && !error ? (
						streamedMessages.map((message) => (
							<ChatPill
								key={message.id}
								{...message}
								toBytes={message.toBytes}
							/>
						))
					) : (
						<>
							{error ? (
								<div className='mt-2 text-[#FF4D4F] text-[1rem]'>
									Error fetching Messages
								</div>
							) : (
								<div>loading</div>
							)}
						</>
					)}
				</div>
				<ChatBox conversation={conversation} />
			</div>
		</div>
	);
};

export default ChatArea;
