export default function AdminSingleUser(props) {
    return (
        <>
            <td>{props.user.id}</td>
            <td>{props.user.email}</td>
        </>
    )
}