import { memo, useCallback } from "react";
import { Dropdown, type DropdownItem } from "@/shared/ui/Dropdown/Dropdown";
import { Avatar } from "@/shared/ui/Avatar/Avatar";
import { Button } from "@/shared/ui/Button/Button";
import { useAppDispatch } from "@/shared/lib/hooks/useAppDispatch/useAppDispatch";
import { userActions } from "@/entities/User";
import { RoutePaths } from "@/shared/const/router";

interface AvatarDropdownProps {
	className?: string;
}

export const AvatarDropdown = memo(({ className }: AvatarDropdownProps) => {
	const dispatch = useAppDispatch();
	const logout = useCallback(() => {
		dispatch(userActions.logout());
	}, [dispatch]);

	const trigger = (
		<Button theme="clear">
			<Avatar size="s" />
		</Button>
	);

	const items: DropdownItem[] = [
		{
			content: "Выйти",
			onClick: logout,
			href: RoutePaths.login,
		},
	];

	return (
		<Dropdown
			className={className}
			trigger={trigger}
			items={items}
			anchorTo="bottom end"
			offset={16}
		/>
	);
});
