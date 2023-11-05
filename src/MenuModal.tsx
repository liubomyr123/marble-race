import { AnimatePresence, motion } from "framer-motion";
import { ReactElement } from "react";

interface ChildrenProps {
    visible: boolean;
    children: ReactElement;
}

export default function ModalContainer({
    visible,
    children,
}: ChildrenProps): JSX.Element {
    return (
        <AnimatePresence>
            {visible && (
                <div className="modal-wrapper">
                    <motion.div
                        className="modal"
                        initial={{ y: 200, opacity: 0 }}
                        animate={{
                            y: 0,
                            opacity: 1,
                        }}
                        exit={{
                            y: -300,
                            opacity: 0,
                        }}
                        transition={{ type: "spring", bounce: 0, duration: 0.9 }}
                    >
                        {children}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
