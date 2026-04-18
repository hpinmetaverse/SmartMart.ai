"use client";
import React from 'react'
import { Button } from '@/components/ui/button'
import userEvent from '@/lib/userEvents'

function TButton({ track = false, productName = "None", ...props }: { track?: boolean, productName?: string, children?: React.ReactNode, [key: string]: any }) {

    const handleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if (track) {
            userEvent('button_click', { productName });
        }
        if (props.onClick) {
            props.onClick(event);
        }
    };

    return (
        <Button {...props} onClick={handleClick}>
            {props.children}
        </Button>
    )
}

export default TButton