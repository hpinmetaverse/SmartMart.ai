import supabaseClient from "./supabase/client";

type UserEventTypes =
    | "button_click"
    | "cart_add"
    | "link_hovered"
    | "image_hovered"
    | "cart_remove";


interface UserEventPayloads {
    button_click: { productName: string; };
    cart_add: { productName: string; };
    cart_remove: { productName: string; };
    image_hovered: { productName: string };
    link_hovered: { productName: string; };

}


const userEvent = <T extends UserEventTypes>(
    event: T,
    payload?: UserEventPayloads[T]
): void => {
    const worker = async () => {
        console.log((await (supabaseClient.auth.getUser())).data.user.id ?? null);
        const { data, error } = await supabaseClient.from("events").insert({
            type: event,
            product_id: payload?.productName,
        })

        if (error) {
            console.error("Error inserting event", error);
        }
    }

    worker();
};


export default userEvent;
