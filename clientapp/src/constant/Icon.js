import { getColor } from "../utility";

export function Avatar({ firstName, lastName, image }) {
    const initials = `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase();

    return (
        <>
            {image ? (
                <img
                    src={image}
                    alt={`${firstName} ${lastName}`}
                    className="rounded-circle me-2"
                    width={50}
                    height={50}
                />
            ) : (
                <div className="avatar text-white me-1"
                style={{ backgroundColor: getColor(firstName || "")}}>
                    {initials}
                </div>
            )}
        </>
    );
};
