import { Stack } from "react-bootstrap";
import { RecentChange } from "./App";

export const RecentChangeItem = (props: {item: RecentChange}) => {

return (
    <Stack>
        <span>{props.item.hierarchy.title} - {props.item.hierarchy.chapter} - {props.item.hierarchy.part}</span>
        <span>{props.item.title}</span>
    </Stack>
);
}