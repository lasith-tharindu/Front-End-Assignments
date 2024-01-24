import { Fragment, PureComponent } from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Link } from "react-router-dom";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { MdSpaceDashboard } from "react-icons/md";
import { HiOutlineBuildingOffice } from "react-icons/hi2";
import { FaUsers } from "react-icons/fa";
import Logo from "../../img/logo.webp";

class SideBars extends PureComponent {
  render() {
    return (
      <Fragment>
        <Sidebar backgroundColor="#0b2948" width="100%">
          <div style={{ display: "flex", flexDirection: "column" }}>
            <img
              src={Logo}
              style={{
                width: "80px",
                position: "absolute",
                top: "1%",
                left: "35%",
              }}
            />
            <div style={{ flex: 1, marginBottom: "5px", marginTop: "100px" }}>
              <div
                style={{
                  padding: "0 24px",
                  marginBottom: "8px",
                  color: "#B6C0C2",
                  fontWeight: "600",
                }}
              >
                General
              </div>
            </div>
          </div>
          <Menu
            menuItemStyles={{
              button: ({ level, active, disabled }) => {
                // only apply styles on first level elements of the tree
                if (level === 0)
                  return {
                    color: "#B6C0C2",
                    backgroundColor: "#0b2948",
                  };
              },
            }}
          >
            <MenuItem
              component={<Link to="/" />}
              icon={<HiOutlineBuildingOffice />}
            >
              {" "}
              Department
            </MenuItem>
            <MenuItem component={<Link to="/user" />} icon={<FaUsers />}>
              User
            </MenuItem>
          </Menu>
        </Sidebar>
      </Fragment>
    );
  }
}

export default SideBars;
