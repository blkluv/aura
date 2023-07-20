import React from 'react';
import { Avatar, Skeleton } from 'antd';
import { useAddress } from '@thirdweb-dev/react';
import { ChatContext } from '../layout/nested-layout';
import { formatTimestamp } from '@/utils';
import { getProfile } from '@/services/profile';

import { PiUserBold } from 'react-icons/pi';

import type { DecodedMessage } from '@xmtp/react-sdk';

interface ChatPillProps extends DecodedMessage {
	isRecentMessage?: boolean;
}

const ChatPill = ({ content, sent, senderAddress }: ChatPillProps) => {
	const address = useAddress();
	const { profiles, isLoading } = React.useContext(ChatContext);
	let profile = getProfile(profiles, senderAddress);
	return (
		<div
			className={`flex gap-4 ${
				senderAddress === address
					? 'self-end flex-row-reverse'
					: 'self-start flex-row'
			}`}
		>
			<div className={`items-start flex`}>
				<Avatar
					size={{ xs: 36, sm: 36, md: 40, lg: 42, xl: 42, xxl: 42 }}
					src={profile?.avatar || <PiUserBold size={32} color='#666666' />}
					className='flex ml-2'
				/>
			</div>
			<div
				className={`flex flex-col gap-1 ${
					senderAddress === address ? 'items-end' : 'items-start'
				}`}
			>
				<div
					className={`flex-row gap-2 items-center flex ${
						senderAddress === address ? 'flex-row-reverse' : 'flex-row'
					}`}
				>
					<div className='font-semibold text-[0.7rem] lg:text-[0.9rem]'>
						{isLoading ? (
							<Skeleton
								active
								paragraph={{
									rows: 0,
									className: '!m-0 !p-0',
								}}
								className='!w-[350px]'
							/>
						) : (
							profile?.name || senderAddress.slice(0, 4) + '...'
						)}
					</div>
					<div className='text-[#A4A8AE] font-medium lg:text-[0.75rem] text-[0.65rem]'>
						{formatTimestamp(sent)}
					</div>
				</div>
				<div
					className={`rounded-xl lg:rounded-2xl py-1 lg:py-3 font-medium text-[1rem] sm:text-[1rem] px-2 md:px-4 whitespace-pre-wrap max-w-[300px] lg:max-w-[500px] break-words ${
						senderAddress === address
							? '!rounded-tr-none bg-[#2176FF] text-white text-right w-fit'
							: 'rounded-tl-none bg-[#F8F8F8]'
					}`}
				>
					{content}
				</div>
			</div>
		</div>
	);
};

export default ChatPill;
