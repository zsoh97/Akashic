import { Menu, MenuButton, IconButton, Icon, MenuList, MenuItem, useToast } from "@chakra-ui/react";
import { FiShare2, FiLink } from "react-icons/fi";
import { RiTelegramLine, RiWhatsappLine, RiTwitterXLine, RiFacebookCircleLine } from "react-icons/ri";

type SocialMediaShareProps = {
	content: string;
};


export const SocialMediaShare = ({content}: SocialMediaShareProps) => {
	const toast = useToast();
	const handleShare = (method: string) => {
		const shareText = `${content} - shared via Akashic`;
		const shareUrl = window.location.href;

		switch (method) {
			case "copy":
				navigator.clipboard.writeText(shareUrl);
				toast({
					title: "Link Copied",
					status: "success",
					duration: 2000,
				});
				break;
			case "x":
				window.open(
					`https://twitter.com/intent/tweet?text=${encodeURIComponent(
						shareText
					)}&url=${encodeURIComponent(shareUrl)}`
				);
				break;
			case "telegram":
				window.open(
					`https://t.me/share/url?url=${encodeURIComponent(
						shareUrl
					)}&text=${encodeURIComponent(shareText)}`
				);
				break;
			case "whatsapp":
				window.open(
					`https://api.whatsapp.com/send?text=${encodeURIComponent(
						shareText + "\n" + shareUrl
					)}`
				);
				break;
			case "facebook":
				window.open(
					`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
						shareUrl
					)}`
				);
				break;
		}
	};
	
	return (
		<Menu>
			<MenuButton
				borderRadius="24px" border="1px" borderColor="sepia.500"
				as={IconButton}
				aria-label="Share options"
				icon={<Icon as={FiShare2} />}
				variant="ghost"
				size="sm"
				color="warmGray.500"
				_hover={{ color: "sepia.500" }}
			/>
			<MenuList>
				<MenuItem
					icon={<Icon as={FiLink} />}
					onClick={(e) => {
						e.stopPropagation();
						handleShare("copy");
					}}
				>
					Copy Link
				</MenuItem>
				<MenuItem
					icon={<Icon as={RiTelegramLine} />}
					onClick={(e) => {
						e.stopPropagation();
						handleShare("telegram");
					}}
				>
					Share on Telegram
				</MenuItem>
				<MenuItem
					icon={<Icon as={RiWhatsappLine} />}
					onClick={(e) => {
						e.stopPropagation();
						handleShare("whatsapp");
					}}
				>
					Share on WhatsApp
				</MenuItem>
				<MenuItem
					icon={<Icon as={RiTwitterXLine} />}
					onClick={(e) => {
						e.stopPropagation();
						handleShare("x");
					}}
				>
					Share on X
				</MenuItem>
				<MenuItem
					icon={<Icon as={RiFacebookCircleLine} />}
					onClick={(e) => {
						e.stopPropagation();
						handleShare("facebook");
					}}
				>
					Share on Facebook
				</MenuItem>
			</MenuList>
		</Menu>
	)

}