import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { logout } from "@/redux/slices/userSlice";
import { useNavigate } from "react-router-dom";

export default function ProfileDetails() {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    gender: "",
    dob: "",
    location: "",
    altMobile: "",
    address: "",
  });

  useEffect(() => {
    console.log("User from Redux:", user);

    if (!user || !user._id) {
      navigate("/login");
    } else {
      setFormData({
        fullName: user.name || "",
        email: user.email || "",
        phone: user.phone || user.mobile_number || user.phone_number || "", // ✅ Correct field used
        gender: user.gender || "",
        dob: user.dob || "",
        location: user.location || "",
        altMobile: user.altMobile || "",
        address: user.address || "",
      });
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    if (!isEditing) return;
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    console.log("Updated Data:", formData);
    alert("Profile updated successfully!");
    setIsEditing(false);
  };

  return (
    <div className="space-y-8 relative">
      <h2 className="text-xl font-semibold text-[#723248] mb-4">
        Profile Details
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label
            htmlFor="fullName"
            className="text-sm font-medium text-gray-700 mb-1 block"
          >
            Full Name
          </Label>
          <Input
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Full Name"
            disabled={!isEditing}
          />
        </div>

        <div>
          <Label
            htmlFor="phone"
            className="text-sm font-medium text-gray-700 mb-1 block"
          >
            Mobile Number
          </Label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Mobile Number"
            disabled={!isEditing}
          />
        </div>

        <div>
          <Label
            htmlFor="email"
            className="text-sm font-medium text-gray-700 mb-1 block"
          >
            Email ID
          </Label>
          <Input
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email ID"
            disabled={!isEditing}
          />
        </div>

        <div>
          <Label
            htmlFor="gender"
            className="text-sm font-medium text-gray-700 mb-1 block"
          >
            Gender
          </Label>
          <Input
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            placeholder="Gender"
            disabled={!isEditing}
          />
        </div>

        <div>
          <Label
            htmlFor="dob"
            className="text-sm font-medium text-gray-700 mb-1 block"
          >
            Date of Birth
          </Label>
          <Input
            id="dob"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            placeholder="Date of Birth"
            disabled={!isEditing}
          />
        </div>

        <div>
          <Label
            htmlFor="location"
            className="text-sm font-medium text-gray-700 mb-1 block"
          >
            Location
          </Label>
          <Input
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Location"
            disabled={!isEditing}
          />
        </div>

        <div>
          <Label
            htmlFor="altMobile"
            className="text-sm font-medium text-gray-700 mb-1 block"
          >
            Alternate Mobile
          </Label>
          <Input
            id="altMobile"
            name="altMobile"
            value={formData.altMobile}
            onChange={handleChange}
            placeholder="Alternate Mobile"
            disabled={!isEditing}
          />
        </div>
      </div>

      {/* <div className="mt-4">
        <Label htmlFor="address" className="text-sm font-medium text-gray-700 mb-1 block">
          Address
        </Label>
        <Input
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Address"
          disabled={!isEditing}
        />
      </div> */}

      <div className="mt-6 flex flex-col sm:flex-row gap-4">
        {isEditing ? (
          <Button
            onClick={handleSave}
            className="bg-[#723248] hover:bg-[#5a1e38] text-white"
          >
            Save Changes
          </Button>
        ) : (
          <Button
            onClick={() => setIsEditing(true)}
            className="bg-[#723248] hover:bg-[#5a1e38] text-white"
          >
            Edit
          </Button>
        )}

        <Button
          variant="outline"
          onClick={() => {
            dispatch(logout());
            navigate("/");
          }}
        >
          Logout
        </Button>
      </div>
    </div>
  );
}
