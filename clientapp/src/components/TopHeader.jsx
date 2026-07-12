import constant, { RoutesStrings } from "../constant/constant";
import { Avatar } from "../constant/Icon";
import socket from "../socket";
import withRouter, { getObjectFromLocalData, getUserFullName, signout } from "../utility";

function TopHeader(props) {
    const userInfo = getObjectFromLocalData(constant.USERINFO);

    const callSignout = () => {
        signout()
        socket.disconnect();
        window.location.href = RoutesStrings.Base
    }

    return <nav class="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
        <div class="container-fluid">

            <a class="navbar-brand" tabIndex="-1">
                <i class="bi bi-chat-dots-fill me-1"></i>
                {getUserFullName(userInfo)}
            </a>

            {/* <form class="d-flex mx-auto search-box" style={{ width: "400px" }}>
                <input class="form-control" placeholder="Search users, groups, messages" />
            </form> */}

            <div class="d-flex align-items-center gap-2">

                {/* <!-- Notifications --> */}
                {/* <button class="btn btn-primary position-relative">
                    <i class="bi bi-bell-fill"></i>
                    <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                        3
                    </span>
                </button> */}

                {/* <!-- Chats --> */}
                {/* <button class="btn btn-primary">
                    <i class="bi bi-chat-left-text-fill"></i>
                </button> */}

                {/* <!-- Dark Mode --> */}
                {/* <button class="btn btn-primary">
                    <i class="bi bi-moon-stars-fill"></i>
                </button> */}

                {/* <!-- User --> */}
                <Avatar firstName={userInfo?.firstname} lastName={userInfo?.lastname} />

                {/* <!-- MENU --> */}
                <div class="dropdown">

                    <button class="btn btn-primary" data-bs-toggle="dropdown">
                        <i class="bi bi-three-dots-vertical"></i>
                    </button>

                    <ul class="dropdown-menu dropdown-menu-end">

                        {/* <li>
                            <a class="dropdown-item" href="#">
                                <i class="bi bi-speedometer2 me-2"></i>
                                Dashboard
                            </a>
                        </li>

                        <li>
                            <hr class="dropdown-divider" />
                        </li> */}

                        <li>
                            <a class="dropdown-item text-danger" tabIndex="-1" onClick={callSignout}>
                                <i class="bi bi-box-arrow-right me-2"></i>
                                Logout
                            </a>
                        </li>

                    </ul>

                </div>

            </div>

        </div>
    </nav>
}

export default withRouter(TopHeader);